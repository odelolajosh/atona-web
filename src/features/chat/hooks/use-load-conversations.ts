import { useCallback, useEffect } from "react";
import { useSecondaryChat } from "../lib/provider";
import { Conversation, Participant, Presence, User, UserStatus } from "@chatscope/use-chat";
import chatAPI from "../lib/api";
import { ChatAPI } from "../lib/types";
import { ConversationData } from "../types";
import { useChat } from "./use-chat";

export const useLoadConversation = (consumerName: string) => {
  const { currentUser, addUser, addConversation } = useChat()
  const { conversationsStatus, setConversationsStatus } = useSecondaryChat(consumerName)

  const loadConversation = useCallback(async (userId: string) => {
    if (conversationsStatus !== "idle") return;

    setConversationsStatus("loading")
    try {
      const conversations = await chatAPI.getConversations(userId)

      if (!conversations) {
        return
      }

      conversations.forEach((conversation: ChatAPI.Conversation) => {
        conversation.users.forEach((u) => {
          addUser(new User({
            id: u.userId,
            presence: new Presence({
              status: u.online ? UserStatus.Available : UserStatus.Away
            }),
            username: u.name,
            avatar: u.avatarUrl,
            data: {}
          }))
        })

        const participants = conversation.users.map((u) => {
          return new Participant({ id: u.userId })
        })

        const newConversation = new Conversation({
          id: conversation.uuid,
          participants,
          data: {
            name: conversation.name,
            type: conversation.chatRoomType === 0 ? "dm" : "group"
          } as ConversationData
        })

        addConversation(newConversation)
      })
      setConversationsStatus("success")
    } catch (err) {
      console.error("Failed to load conversation", err)
      setConversationsStatus("error")
    }
  }, [conversationsStatus, setConversationsStatus, addConversation, addUser])

  useEffect(() => {
    if (!currentUser) return;
    loadConversation(currentUser.id)
  }, [currentUser, loadConversation])

  return {
    loadConversation,
    conversationsStatus
  }
}