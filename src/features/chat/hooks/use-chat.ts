import { useChat as _useChat } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";
import { ChatService } from "../lib/chat-service";

type UseChat = ReturnType<typeof _useChat<ConversationData, UserData>> & {
  service: ChatService
}

export const useChat = () => {
  const chat = _useChat<ConversationData, UserData>() as UseChat

  const removeAllUsers = () => {
    const existingUsers = chat.users || []
    existingUsers.forEach((user) => {
      chat.removeUser?.(user.id)
    })
  }

  const removeAllConversations = () => {
    const existingConversations = chat.conversations || []
    existingConversations.forEach((conversation) => {
      chat.removeConversation?.(conversation.id, true)
    })
  }

  return {
    ...chat,
    removeAllUsers,
    removeAllConversations
  }
};