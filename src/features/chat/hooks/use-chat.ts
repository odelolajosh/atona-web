import { useChat as _useChat } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";
import { ChatService } from "../lib/chat-service";
import { useChatUI } from "../lib/provider";

type UseChat = ReturnType<typeof _useChat<ConversationData, UserData>> & {
  service: ChatService
}

export const useChat = (consumer: string = "useChat") => {
  const chat = _useChat<ConversationData, UserData>() as UseChat
  const chatUI = useChatUI(consumer)

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
    ...chatUI,
    removeAllUsers,
    removeAllConversations
  }
};