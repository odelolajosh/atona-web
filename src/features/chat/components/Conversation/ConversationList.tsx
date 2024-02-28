import { Conversation as TConversation } from "@chatscope/use-chat"
import { useTypedChat } from "../../hooks/useChat"
import { ConversationData } from "../../types"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "../Avatar"

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
  const { activeConversation, setActiveConversation, getUser } = useTypedChat()

  const [avatar, name] = useMemo(() => {
    const participant = c.participants.length > 0 ? c.participants[0] : undefined;
    if (participant) {
      const user = getUser(participant.id);
      if (user) {
        return [user.avatar, c.data?.name || user.username]
      }
    }
    return [undefined, ""]
  }, [c])

  return (
    <div className={cn(
      "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-primary-500",
      {
        "bg-info hover:bg-info": activeConversation?.id === c.id
      }
    )} onClick={() => setActiveConversation(c.id)}>
      <Avatar conversation={c} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="text-white font-medium">{name}</div>
      </div>
    </div>
  )
}

export const ConversationList = () => {
  const { conversations } = useTypedChat()

  return (
    <div className="w-[var(--chat-list-width)] bg-primary-800 flex flex-col">
      <div className="py-4 px-6">
        <input type="text" className="w-full h-12 bg-primary-500 rounded-2xl px-6" placeholder="Search..." />
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2" style={{ scrollbarWidth: "none" }}>
        {conversations.map((c) => <Conversation key={c.id} conversation={c} />)}
        {/* <Conversation avatar="https://i.pravatar.cc/300?img=1" name="John Doe" message="Hello" time="10:00" />
        <Conversation avatar="https://i.pravatar.cc/300?img=2" name="Jane Doe" message="Hi" time="10:01" />
        <Conversation avatar="https://i.pravatar.cc/300?img=3" name="John Smith" message="How are you?" time="10:02" /> */}
      </div>
    </div>
  )
}