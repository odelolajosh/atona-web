import { useTypedChat } from "../../hooks/useChat"
import { Avatar } from "../Avatar"
import { useConversation } from "../../hooks/useConversation"
import { Helmet } from "react-helmet-async"

export const ConversationHeader = () => {
  const { activeConversation } = useTypedChat()
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