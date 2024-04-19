import { useChat } from "../../hooks/use-chat"
import { Avatar } from "../avatar"
import { useConversation } from "../../hooks/use-conversation"
import { Helmet } from "react-helmet-async"

export const ConversationHeader = () => {
  const { activeConversation } = useChat()
  const { name } = useConversation(activeConversation?.id || "")

  return (
    <>
      <Helmet>
        <title>{name} - Atona GCS</title>
      </Helmet>
      <div className="w-full h-[var(--chat-header-height)] flex gap-3 items-center px-4">
        <Avatar name={name} />
        <h2 className="font-medium text-lg">{name}</h2>
      </div>
    </>
  )
}