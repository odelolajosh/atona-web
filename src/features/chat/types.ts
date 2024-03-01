import { Conversation } from "@chatscope/use-chat"

export interface ChatState {
  currentUser?: User
  users: User[]
  conversations: Conversation[]
  activeConversation?: Conversation
}

export interface ConversationData {
  readonly type?: 'dm' | 'group'
  readonly name: string
  initialMessageStatus?: 'idle' | 'success' | 'error' | 'loading'
}

export interface IMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly from: string;
  readonly text: string;
  readonly createdAt: Date | string | number;
}

export interface User {
  name: string
  avatar: string
}

export interface UserData { }