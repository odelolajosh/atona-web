import { Conversation } from "@chatscope/use-chat"
import { ConversationData } from "../types"
import { useMemo } from "react"
import { useTypedChat } from "../hooks/useChat"
import { cn } from "@/lib/utils"

type AvatarProps = {
  conversation: Conversation<ConversationData>
} & React.HTMLAttributes<HTMLDivElement>

export const Avatar = ({ conversation: c, ...props }: AvatarProps) => {
  const { getUser } = useTypedChat()

  const [avatar, initials] = useMemo(() => {
    const participant = c.participants.length > 0 ? c.participants[0] : undefined;
    if (participant) {
      const user = getUser(participant.id);
      if (user) {
        return [user.avatar, user.username.substring(0, 2).toUpperCase()]
      }
    }
    return [undefined, ""]
  }, [c])

  return (
    <div {...props} className={cn("flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center", props.className)}>
      {avatar ? <img src={avatar} alt="avatar" className="w-full h-full rounded-full" /> : initials}
    </div>
  )
}