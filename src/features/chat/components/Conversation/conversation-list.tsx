import { Conversation as TConversation } from "@chatscope/use-chat"
import { useChat } from "../../hooks/use-chat"
import { ConversationData } from "../../types"
import { cn } from "@/lib/utils"
import { Avatar } from "../avatar"
import { useConversation } from "../../hooks/use-conversation"
import { useNavigate } from "react-router-dom"
import { AddConversationModal } from "."
import { Spinner } from "@/components/icons/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil2Icon } from "@radix-ui/react-icons"

type ConversationProps = {
  conversation: TConversation<ConversationData>
}

const Conversation = ({ conversation: c }: ConversationProps) => {
  const navigate = useNavigate()
  const { activeConversation } = useChat()
  const { name } = useConversation(c.id)

  return (
    <div className={cn(
      "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-muted/50",
      {
        "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground": activeConversation?.id === c.id
      }
    )} onClick={() => navigate(`/chat/${c.id}`)}>
      <Avatar name={name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="text-white font-medium">{name}</div>
      </div>
    </div>
  )
}

export const ConversationList = () => {
  const { conversations, conversationStatus } = useChat()

  return (
    <div className="w-[var(--chat-list-width)] flex flex-col relative">
      <div className="py-4 px-6">
        <Input type="text" placeholder="Search..." autoComplete="off" />
      </div>
      {conversationStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2" style={{ scrollbarWidth: "none" }}>
            {conversations.map((c) => <Conversation key={c.id} conversation={c} />)}
          </div>
          {/* Floating button */}
          <AddConversationModal>
            <Button className="absolute bottom-4 right-4 gap-2" size="lg">
              <Pencil2Icon /> New conversation
            </Button>
          </AddConversationModal>
        </>
      )}
    </div>
  )
}