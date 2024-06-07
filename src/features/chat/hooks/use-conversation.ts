import { useMemo } from "react"
import { useChat } from "./use-chat"
import { Conversation, User } from "@chatscope/use-chat"
import { ConversationData, UserData } from "../types"

export const getConversationMeta = (conversation: Conversation<ConversationData>, currentUserId: string, getUser: (id: string) => User<UserData> | undefined) => {
  if (conversation.data?.type === "group") {
    return {
      name: conversation.data.name,
      avatar: ""
    }
  } else {
    const otherparticipant = conversation.participants.find(p => p.id !== currentUserId)
    if (otherparticipant) {
      const user = getUser(otherparticipant.id)
      if (user) {
        return {
          name: user.username,
          avatar: user.avatar
        }
      }
    }
  }
  return {
    name: "",
    avatar: undefined
  }
}

export const useConversation = (conversationId: string) => {
  const { getConversation, getUser, currentUser } = useChat()

  return useMemo(() => {
    const c = getConversation(conversationId)
    if (c) {
      if (c.data?.type === "group") {
        return {
          name: c.data.name,
          avatar: ""
        }
      } else {
        // get the first user that is not the current user
        const otherparticipant = c.participants.find(p => currentUser?.id !== p.id)
        if (otherparticipant) {
          const user = getUser(otherparticipant?.id)
          if (user) {
            return {
              name: user?.username,
              avatar: user?.avatar
            }
          }
        }
      }
    }
    return {
      name: "",
      avatar: undefined
    }
  }, [conversationId, currentUser?.id, getConversation, getUser])
}