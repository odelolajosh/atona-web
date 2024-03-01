import { Conversation as TConversation } from "@chatscope/use-chat"
import { useTypedChat } from "../../hooks/useChat"
import { ConversationData } from "../../types"
import { cn } from "@/lib/utils"
import { Avatar } from "../Avatar"
import { Button, Input } from "@/components/ui"
import { useConversation } from "../../hooks/useConversation"

// type ConversationProps = {
//   avatar: string
//   name: string
//   message: string
//   time: string
// }

// const Conversation = ({ avatar, name, message, time }: ConversationProps) => {
//   return (
//     <div className="flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer hover:bg-primary-700">
//       <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
//       <div className="flex-1">
//         <div className="text-white font-medium">{name}</div>
//         <div className="text-gray-400 text-xs">{message}</div>
//       </div>
//       <div className="text-gray-400 text-sm">{time}</div>
//     </div>
//   )
// }

type ConversationProps = {
  conversation: TConversation<ConversationData>
}

const Conversation = ({ conversation: c }: ConversationProps) => {
  const { activeConversation, setActiveConversation } = useTypedChat()
  const { name } = useConversation(c.id)

  return (
    <div className={cn(
      "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-secondary/50",
      {
        "bg-primary hover:bg-primary": activeConversation?.id === c.id
      }
    )} onClick={() => setActiveConversation(c.id)}>
      <Avatar name={name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="text-white font-medium">{name}</div>
      </div>
    </div>
  )
}

export const ConversationList = () => {
  const { conversations, conversationLoading, setShowAddConversation } = useTypedChat()

  return (
    <div className="w-[var(--chat-list-width)] flex flex-col relative">
      <div className="py-4 px-6">
        <Input type="text" placeholder="Search..." />
      </div>
      {conversationLoading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-6 w-6 mx-auto text-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2" style={{ scrollbarWidth: "none" }}>
            {conversations.map((c) => <Conversation key={c.id} conversation={c} />)}
            {/*
              <Conversation avatar="https://i.pravatar.cc/300?img=1" name="John Doe" message="Hello" time="10:00" />
              <Conversation avatar="https://i.pravatar.cc/300?img=2" name="Jane Doe" message="Hi" time="10:01" />
              <Conversation avatar="https://i.pravatar.cc/300?img=3" name="John Smith" message="How are you?" time="10:02" />
            */}
          </div>
          {/* Floating button */}
          <Button className="absolute bottom-4 right-4" size="sm" onClick={() => setShowAddConversation(true)}>Add conversation</Button>
        </>
      )}
    </div>
  )
}