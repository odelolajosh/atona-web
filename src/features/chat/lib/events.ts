import { ChatEvent, Conversation } from "@chatscope/use-chat";
import { ConversationData } from "../types";

// same as ChatEventType enum's string values in @chatscope/use-chat
export type BaseChatEventType = 'message' | 'connectionStateChanged' | 'userConnected' | 'userDisconnected' | 'userPresenceChanged' | 'userTyping'

export type ChatEventType = BaseChatEventType | 'conversationJoined'

export type ChatEventHandler<T extends ChatEventType, E extends ChatEvent<T>> = (event: E) => void;

export class ConversationJoinedEvent implements ChatEvent<'conversationJoined'> {
  readonly type = 'conversationJoined';
  constructor(public conversation: Conversation<ConversationData>) {}
}