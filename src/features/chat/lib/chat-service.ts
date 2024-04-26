/* eslint-disable @typescript-eslint/no-explicit-any */
import SturdyWebSocket from "@/lib/ws";
import { ChatEvent, ChatEventType as BaseChatEventType, ConnectionState, ConnectionStateChangedEvent, IChatService, IStorage, MessageContentType, MessageDirection, MessageEvent, MessageStatus, SendMessageServiceParams, SendTypingServiceParams, UpdateState, Conversation, Participant } from "@chatscope/use-chat";
import { ChatEventHandler, ChatEventType, ConversationJoinedEvent } from "./events";
import { ConversationData, UserData } from "../types";
import { wsURL } from "./api";
import { ChatAPI } from "./types";

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
  storage?: IStorage<ConversationData, UserData>;
  updateState: UpdateState;
  ws?: SturdyWebSocket;
  userId?: string;

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
  }

  /**
   * Establishes connection with the websocket
   * @param userId authenticates websocket connection
   */
  connect(userId: string) {
    if (this.ws && this.userId === userId) {
      return;
    }

    const url = `${wsURL}/${userId}`;

    this.userId = userId
    this.ws = new SturdyWebSocket(url, {
      connectTimeout: 1000,
      debug: true,
      minReconnectDelay: 1000,
      maxReconnectDelay: 10000,
      maxReconnectAttempts: 5
    })

    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({
        type: "on_connect",
      }))
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Connected))
    }

    this.ws.onreopen = () => {
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Connected))
    }

    this.ws.ondown = () => {
      this.emit("connectionStateChanged", new ConnectionStateChangedEvent(ConnectionState.Disconnected))
    }

    this.ws.onmessage = (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      this.dispatchEventOfType(data.type, data.payload)
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
   * Join a conversation
   * @param conversationId 
   */
  joinConversation(conversationId: string) {
    this.ws?.send(JSON.stringify({
      type: "on_join",
      payload: conversationId
    }))
  }

  /**
   * Creates a new conversation
   * @param userIds an array of user Ids to add to a conversation
   */
  createConversation(userIds: string[] = []) {
    if (userIds.length === 0) return;
    this.ws?.send(JSON.stringify({
      type: "on_join",
      payload: {
        users: userIds
      }
    }))
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    this.ws?.send(JSON.stringify({
      type: "on_message",
      payload: {
        body: message.content?.content,
        content_type: String(message.contentType),
        to_id: conversationId,
      }
    }))

    return message;
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
  private dispatchEventOfType(type: string, payload: any) {
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
    }
  }

  private handleConnection() {
    const event = new ConnectionStateChangedEvent(ConnectionState.Connected)
    this.emit("connectionStateChanged", event)
  }

  private handleRoomCreated(payload: { room: ChatAPI.Room, roomId: string }) {
    if (!payload.room) return
    const users = payload.room.users ?? [];
    const participants = users.map((user: ChatAPI.User) => new Participant({ id: user.uuid }))

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
        senderId: payload.from.uuid,
        status: MessageStatus.Sent,
        createdTime: payload.created_at
      },
      conversationId: payload.to.uuid,
    })
    this.emit("message", event)
  }
}
