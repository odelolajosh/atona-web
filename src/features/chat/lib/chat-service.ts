/* eslint-disable @typescript-eslint/no-explicit-any */
import SturdyWebSocket from "@/lib/ws";
import { ChatEvent, ChatEventType as BaseChatEventType, ConnectionState, ConnectionStateChangedEvent, IChatService, IStorage, MessageContentType, MessageDirection, MessageEvent, MessageStatus, SendMessageServiceParams, SendTypingServiceParams, UpdateState, Conversation, Participant, User, Presence, UserStatus, ChatMessage, UserPresenceChangedEvent } from "@chatscope/use-chat";
import { ChatEventHandler, ChatEventType, ConversationJoinedEvent } from "./events";
import { ConversationData, UserData } from "../types";
import { ChatAPI } from "./types";
import { __DEV__, wsUrl } from "./const";
import { luid } from "@/lib/utils";

type EventHandlers = {
  onMessage: Array<ChatEventHandler<
    BaseChatEventType.Message,
    ChatEvent<BaseChatEventType.Message>
  >>;
  onConnectionStateChanged: Array<ChatEventHandler<
    BaseChatEventType.ConnectionStateChanged,
    ChatEvent<BaseChatEventType.ConnectionStateChanged>
  >>;
  onUserConnected: Array<ChatEventHandler<
    BaseChatEventType.UserConnected,
    ChatEvent<BaseChatEventType.UserConnected>
  >>;
  onUserDisconnected: Array<ChatEventHandler<
    BaseChatEventType.UserDisconnected,
    ChatEvent<BaseChatEventType.UserDisconnected>
  >>;
  onUserPresenceChanged: Array<ChatEventHandler<
    BaseChatEventType.UserPresenceChanged,
    ChatEvent<BaseChatEventType.UserPresenceChanged>
  >>;
  onUserTyping: Array<ChatEventHandler<
    BaseChatEventType.UserTyping,
    ChatEvent<BaseChatEventType.UserTyping>
  >>;
  onConversationJoined: Array<ChatEventHandler<
    "conversationJoined",
    ChatEvent<"conversationJoined">
  >>;
  [key: string]: Array<any>;
};

export class ChatService implements IChatService {
  storage: IStorage<ConversationData, UserData>;
  updateState: UpdateState;
  ws?: SturdyWebSocket;
  userId?: string;
  unacknowledgedMessages: Map<string, ChatMessage<MessageContentType>>;

  eventHandlers: EventHandlers = {
    onMessage: [],
    onConnectionStateChanged: [],
    onUserConnected: [],
    onUserDisconnected: [],
    onUserPresenceChanged: [],
    onUserTyping: [],
    onConversationJoined: [],
  };

  constructor(storage: IStorage<ConversationData, UserData>, update: UpdateState) {
    this.storage = storage;
    this.updateState = update;
    this.unacknowledgedMessages = new Map();
  }

  /**
   * Establishes connection with the websocket
   * @param userId authenticates websocket connection
   * @param token authenticates websocket connection
   */
  connect(userId: string) {
    if (this.ws && this.userId === userId) {
      return;
    }

    const url = `${wsUrl}/${userId}`

    this.userId = userId
    this.ws = new SturdyWebSocket(url, {
      connectTimeout: 5000,
      debug: true,
      minReconnectDelay: 1000,
      maxReconnectDelay: 10000,
      maxReconnectAttempts: 5,
    })

    console.info("Naerochat", "Connecting to", url)

    this.ws.onopen = () => {
      console.info("Naerochat", "Connection is up")
      this.ws?.send(JSON.stringify({
        id: luid(),
        type: "on_connect",
        payload: {
          userId,
        }
      }))
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Connected))
    }

    this.ws.onreopen = () => {
      console.info("Naerochat", "Connection is back up")
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Connected))
    }

    this.ws.ondown = () => {
      console.info("Naerochat", "Connection to our server is down")
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Disconnected))
    }

    this.ws.onmessage = (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (__DEV__) {
        console.log("Naerochat", "Received message", data)
      }
      this.dispatchEventOfType(data.id, data.type, data.payload)
    }

    this.ws.onclose = () => {
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Disconnected))
    }

    this.ws.onerror = () => {
      console.error("Socket encountered error. Closing socket");
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Disconnected))
    }
  }

  /**
   * Creates a new conversation
   * @param userIds an array of user Ids to add to a conversation
   */
  createConversation(userIds: string[] = [], name?: string) {
    if (userIds.length === 0) return;
    this.ws?.send(JSON.stringify({
      type: "on_join",
      id: luid(),
      payload: {
        users: userIds,
        name,
      }
    }))
  }

  /**
   * Creates a new DM conversation
   * @param userIds an array of user Ids to add to a conversation
   * @param message the initial message to send to the conversation
   */
  createDmConversation(userIds: string[] = [], message: string) {
    if (userIds.length === 0) return;
    this.ws?.send(JSON.stringify({
      type: "on_dm",
      id: luid(),
      payload: {
        users: userIds,
        initial_message: message
      }
    }))
  }

  /**
   * Creates a new group conversation
   * @param userIds an array of user Ids to add to a conversation
   * @param name the name of the group
   */
  createGroupConversation(userIds: string[] = [], name: string) {
    if (userIds.length === 0) return;
    this.ws?.send(JSON.stringify({
      type: "on_group",
      id: luid(),
      payload: {
        users: userIds,
        name
      }
    }))
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    if (!this.ws) return
    this.unacknowledgedMessages.set(message.id, message)

    const otherUserId = conversationId.startsWith("t_") ? conversationId.split("_")[1] : conversationId

    this.ws?.send(JSON.stringify({
      type: "on_message",
      id: message.id,
      payload: {
        body: message.content?.content,
        content_type: String(message.contentType),
        to_id: conversationId,
        from_id: message.senderId,
        // Compulsoty for initial messages, we need to send the users in the conversation
        initial: conversationId.startsWith("t_"),
        users: [message.senderId, otherUserId]
      }
    }))

    return message;
  }

  ping() {
    this.ws?.send(JSON.stringify({
      type: "on_ping"
    }))
  }

  sendTyping({
    isTyping,
    content,
    conversationId,
    userId,
  }: SendTypingServiceParams) {
    // We send the "typing" signalization using a CustomEvent dispatched to the window object.
    // It is received in the callback assigned in the constructor
    // In a real application, instead of dispatching the event here,
    // you will implement sending signalization to your chat server.
    const typingEvent = new CustomEvent("chat-protocol", {
      detail: {
        type: "typing",
        isTyping,
        content,
        conversationId,
        userId,
        sender: this,
      },
    });

    window.dispatchEvent(typingEvent);
  }

  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key].push(evtHandler);
    }
  }

  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    eventHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      const index = this.eventHandlers[key].indexOf(eventHandler);
      if (index >= 0) {
        this.eventHandlers[key].splice(index, 1);
      }
    }
  }

  /**
   * Emits an event to all registered event handlers
   * @param evtType
   * @param evt
   * @private
   */
  private emit<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evt: H
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key].forEach((handler) => handler(evt));
    }
  }

  /**
   * Dispatches an event to the appropriate event handler
   * @param type
   * @param payload
   * @private
   */
  private dispatchEventOfType(id: string, type: string, payload: any) {
    switch (type) {
      case "connected": {
        this.handleConnection()
        break
      }
      case "room_created": {
        this.handleRoomCreated(payload)
        break
      }
      case "message_sent": {
        this.handleIncomingMessage(payload)
        break
      }
      case "ack_on_message": {
        this.handleMessageAcknowledgement(id)
        break
      }
    }
  }

  private handleConnection() {
    const connectionStateChangeEvent = new ConnectionStateChangedEvent(ConnectionState.Connected)
    this.emit("connectionStateChanged", connectionStateChangeEvent)

    if (this.userId) {
      const userPresenceChangedEvent = new UserPresenceChangedEvent({
        userId: this.userId,
        presence: new Presence({
          status: UserStatus.Available
        })
      })

      this.emit("userPresenceChanged", userPresenceChangedEvent)
    }
  }

  private handleRoomCreated(payload: { room: ChatAPI.Room, roomId: string }) {
    if (!payload.room) return
    const users = payload.room.users ?? [];

    this.addAllUsers(users)

    const participants = users.map((user: ChatAPI.User) => new Participant({ id: user.userId }))

    const conversation = new Conversation<ConversationData>({
      id: payload.roomId,
      participants,
      data: {
        name: payload.room.name,
        type: payload.room.chatRoomType === 0 ? "dm" : "group",
      }
    })

    const event = new ConversationJoinedEvent(conversation)
    this.emit("conversationJoined", event)
  }

  private handleIncomingMessage(payload: any) {
    const event = new MessageEvent({
      message: {
        id: payload.id,
        content: {
          content: payload.body,
        },
        contentType: MessageContentType.TextHtml,
        direction: MessageDirection.Incoming,
        senderId: payload.from_id,
        status: MessageStatus.Sent,
        createdTime: payload.created_at
      },
      conversationId: payload.to_id
    })
    this.emit("message", event)
  }

  private handleMessageAcknowledgement(id: string) {
    const message = this.unacknowledgedMessages.get(id)
    if (!message) return
    message.status = MessageStatus.Sent
    this.updateState()
  }

  private addAllUsers(users: ChatAPI.User[]) {
    users.forEach((user) => {
      // the storage already prevents duplicates id
      const newUser = new User({
        id: user.userId,
        presence: new Presence({
          status: user.online ? UserStatus.Available : UserStatus.Away
        }),
        username: user.name,
        avatar: user.avatarUrl,
        data: {}
      })
      this.storage?.addUser(newUser)
    })
  }
}
