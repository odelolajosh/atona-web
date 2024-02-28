import { useMemo } from "react"
import { useTypedChat } from "../../hooks/useChat"
import { Avatar } from "../Avatar"

export const ConversationHeader = () => {
  const { activeConversation, getUser } = useTypedChat()

  const name = useMemo(() => {
    if (!activeConversation) {
      return ""
    }
    const participant = activeConversation?.participants.length > 0 ? activeConversation.participants[0] : undefined;
    if (participant) {
      const user = getUser(participant.id);
      if (user) {
        return activeConversation.data?.name ?? user.username
      }
    }
  }, [activeConversation])

  if (!activeConversation) {
    return null
  }

  return (
    <div className="w-full h-[var(--chat-header-height)] flex gap-3 items-center px-4">
      <Avatar conversation={activeConversation} />
      <h2 className="font-medium text-lg">{name}</h2>
    </div>
  )
}