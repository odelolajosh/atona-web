import { useMemo } from "react"
import { useTypedChat } from "./useChat"

export const useConversation = (conversationId: string) => {
  const { getConversation, getUser, currentUser } = useTypedChat()

  return useMemo(() => {
    const c = getConversation(conversationId)
    if (c) {
      if (c.data?.type === "dm") {
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
      } else if (c.data?.type === "group") {
        return {
          name: c.data.name,
          avatar: ""
        }
      }
    }
    return {
      name: "",
      avatar: undefined
    }
  }, [conversationId])
}