import { MessageContent, MessageContentType, MessageDirection, useChat } from "@chatscope/use-chat"
import { PropsWithChildren, useMemo } from "react"
import { MessageHtmlContent } from "./MessageHtmlContent"
import { Avatar } from "./Avatar"
import { cn } from "@/lib/utils"

type MessageProps<T extends MessageContentType> = {
  model: {
    senderId: string,
    type: MessageContentType,
    payload: MessageContent<T>,
    direction: MessageDirection
  },
  position: number
}

export const Message = <T extends MessageContentType>({
  model: {
    type = MessageContentType.TextMarkdown,
    payload,
    direction,
    senderId
  },
  position
}: MessageProps<T>) => {
  type; // to avoid unused variable warning

  const { getUser } = useChat()

  const user = useMemo(() => {
    const user = getUser(senderId)
    return user
  }, [senderId])

  const containerClass = cn(
    "grow flex w-full px-4 py-1",
    "hover:bg-neutral-600/10",
    "message"
  )

  const messageClass = cn(
    "px-4 py-2 rounded-lg text-white max-w-[min(80%,32rem)]",
    {
      "message--incoming mr-auto ml-12": direction === MessageDirection.Incoming,
      "message--outgoing ml-auto": direction === MessageDirection.Outgoing,
      "message--first": position === 0,
    },
  )

  const messageJsx = useMemo(() => {
    switch (type) {
      case MessageContentType.TextMarkdown:
      case MessageContentType.TextHtml:
        return <MessageHtmlContent html={payload.content as any} />
      default:
        return (
          <div>{payload.content as any}</div>
        )
    }
  }, [type, payload])

  return (
    <div className={containerClass}>
      <div className={messageClass}>
        {/* Header */}
        {
          (position === 0 && direction === MessageDirection.Incoming) && (
            <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-400">{user?.username}</div>
            </div>
          )
        }
        {/* Content */}
        {messageJsx}
      </div>
    </div>
  )
}

type MessageGroupProps = PropsWithChildren<{
  direction: MessageDirection,
  avatar?: string
}>

export const MessageGroup: React.FC<MessageGroupProps> = ({
  direction,
  avatar = "https://avatars.githubusercontent.com/u/25190563?v=4",
  children
}) => {
  return (
    <section className={cn("relative", "message--group")}>
      {/* Avatar */}
      <Avatar className={cn(
        "absolute top-4",
        {
          "left-6": direction === MessageDirection.Incoming,
          "right-6 hidden": direction === MessageDirection.Outgoing
        }
      )} url={avatar} />
      {/* Message */}
      <div className="flex flex-col w-full">
        {children}
      </div>
    </section>
  )
}