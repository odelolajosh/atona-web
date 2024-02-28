import SturdyWebSocket from "@/lib/ws";
import { ChatEvent, ChatEventHandler, ChatEventType, ChatMessage, ConnectionState, ConnectionStateChangedEvent, IChatService, IStorage, MessageContentType, MessageDirection, MessageEvent, SendMessageServiceParams, SendTypingServiceParams, UpdateState } from "@chatscope/use-chat";

type EventHandlers = {
  onMessage: ChatEventHandler<
    ChatEventType.Message,
    ChatEvent<ChatEventType.Message>
  >;
  onConnectionStateChanged: ChatEventHandler<
    ChatEventType.ConnectionStateChanged,
    ChatEvent<ChatEventType.ConnectionStateChanged>
  >;
  onUserConnected: ChatEventHandler<
    ChatEventType.UserConnected,
    ChatEvent<ChatEventType.UserConnected>
  >;
  onUserDisconnected: ChatEventHandler<
    ChatEventType.UserDisconnected,
    ChatEvent<ChatEventType.UserDisconnected>
  >;
  onUserPresenceChanged: ChatEventHandler<
    ChatEventType.UserPresenceChanged,
    ChatEvent<ChatEventType.UserPresenceChanged>
  >;
  onUserTyping: ChatEventHandler<
    ChatEventType.UserTyping,
    ChatEvent<ChatEventType.UserTyping>
  >;
  [key: string]: any;
};

export class ChatService<ConversationData = any, UserData = any> implements IChatService {
  storage?: IStorage<ConversationData, UserData>;
  updateState: UpdateState;
  ws: SturdyWebSocket;

  eventHandlers: EventHandlers = {
    onMessage: () => {},
    onConnectionStateChanged: () => {},
    onUserConnected: () => {},
    onUserDisconnected: () => {},
    onUserPresenceChanged: () => {},
    onUserTyping: () => {},
  };

  constructor(storage: IStorage<ConversationData, UserData>, update: UpdateState) {
    this.storage = storage;
    this.updateState = update;

    // For communication we use CustomEvent dispatched to the window object.
    // It allows you to simulate sending and receiving data from the server.
    // In a real application, instead of adding a listener to the window,
    // you will implement here receiving data from your chat server.

    // TODO: here !

    this.ws = new SturdyWebSocket("ws://localhost:8080/ws", {
      connectTimeout: 1000,
      debug: true,
      minReconnectDelay: 1000,
      maxReconnectDelay: 10000,
      maxReconnectAttempts: 5
    });

    this.ws.onopen = () => {
      this.eventHandlers.onConnectionStateChanged(
        new ConnectionStateChangedEvent(ConnectionState.Connected)
      );
    }

    this.ws.onreopen = () => {
      this.eventHandlers.onConnectionStateChanged(
        new ConnectionStateChangedEvent(ConnectionState.Connected)
      );
    }

    this.ws.ondown = () => {
      this.eventHandlers.onConnectionStateChanged(
        new ConnectionStateChangedEvent(ConnectionState.Connected)
      );  
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message as ChatMessage<MessageContentType>;
      const conversationId = data.conversationId as string;
      message.direction = MessageDirection.Incoming;

      this.eventHandlers.onMessage(
        new MessageEvent({ message, conversationId })
      );
    }

    this.ws.onclose = () => {
      this.eventHandlers.onConnectionStateChanged(
        new ConnectionStateChangedEvent(ConnectionState.Disconnected)
      );
    }

    this.ws.onerror = () => {
      this.eventHandlers.onConnectionStateChanged?.(
        new ConnectionStateChangedEvent(ConnectionState.Connected)
      );
    }
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    // this.ws.send(JSON.stringify({
    //   type: "message",
    //   content: message,
    //   conversationId: conversationId
    // }));

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

  // The ChatProvider registers callbacks with the service.
  // These callbacks are necessary to notify the provider of the changes.
  // For example, when your service receives a message, you need to run an onMessage callback,
  // because the provider must know that the new message arrived.
  // Here you need to implement callback registration in your service.
  // You can do it in any way you like. It's important that you will have access to it elsewhere in the service.
  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }

  // The ChatProvider can unregister the callback.
  // In this case remove it from your service to keep it clean.
  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    eventHandler: ChatEventHandler<T, H>
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }
}