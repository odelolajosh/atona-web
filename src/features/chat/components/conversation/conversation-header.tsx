import { useChat } from "../../hooks/use-chat"
import { ChatAvatar } from "../chat-avatar"
import { useConversation } from "../../hooks/use-conversation"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/button"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"

export const ConversationHeader = () => {
  const { activeConversation } = useChat()
  const { name, avatar } = useConversation(activeConversation?.id || "")
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>{name} - Atona GCS</title>
      </Helmet>
      <div className="w-full h-[var(--chat-header-height)] flex gap-3 items-center px-4">
        <ChatAvatar src={avatar} name={name} />
        <h2 className="flex-1 font-medium text-lg text-ellipsis overflow-hidden">{name}</h2>
        <Button size="icon" className="ml-auto bg-transparent rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" onClick={() => navigate("/chat")}>
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </>
  )
}