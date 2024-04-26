import { useCallback, useEffect } from "react";
import { useChatState } from "../lib/provider";
import { Conversation, Participant, Presence, User, UserStatus } from "@chatscope/use-chat";
import chatAPI from "../lib/api";
import { __DEV__ } from "../lib/const";
import { ChatAPI } from "../lib/types";
import { ConversationData } from "../types";
import { useChat } from "./use-chat";

export const useLoadConversation = (consumerName: string) => {
  const { currentUser, addUser, addConversation, removeAllUsers, removeAllConversations } = useChat()
  const { conversationsStatus, setConversationsStatus } = useChatState(consumerName)

  const loadConversation = useCallback(async (userId: string) => {
    if (__DEV__) return;

    if (conversationsStatus !== "idle") return;

    setConversationsStatus("loading")
    try {
      const result = await Promise.all([
        chatAPI.getUsers(),
        chatAPI.getConversations(userId)
      ])

      if (!result[0] || !result[1]) return

      const [users, conversations] = result;

      // remove all existing users
      removeAllUsers()
      removeAllConversations()

      users.forEach((user) => {
        const newUser = new User({
          id: user.uuid,
          presence: new Presence({
            status: user.online ? UserStatus.Available : UserStatus.Away
          }),
          username: user.name,
          avatar: user.avatarUrl,
          data: {}
        })
        addUser(newUser)
      })

      conversations.forEach((conversation: ChatAPI.Conversation) => {
        const participants = conversation.users.map((u) => {
          return new Participant({ id: u.uuid })
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
  }, [addConversation, addUser, removeAllConversations, removeAllUsers, conversationsStatus, setConversationsStatus])

  useEffect(() => {
    if (!currentUser) return;
    loadConversation(currentUser.id)
  }, [currentUser, loadConversation])

  return {
    loadConversation,
    conversationsStatus
  }
}