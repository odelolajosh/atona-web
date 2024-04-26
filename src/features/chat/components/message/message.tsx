import { GalleryItem, MessageContent, MessageContentType, MessageDirection, useChat } from "@chatscope/use-chat"
import { PropsWithChildren, useMemo } from "react"
import { MessageHtmlContent } from "./message-html-content"
import { cn } from "@/lib/utils"
import { formatDate } from "../../lib/utils"
import { MessageGalleryContent } from "./message-gallery-content"
import { ChatAvatar } from "../chat-avatar"

type MessageProps<T extends MessageContentType> = {
  model: {
    senderId: string,
    type: MessageContentType,
    payload: MessageContent<T>,
    direction: MessageDirection,
    updatedAt: Date,
  },
  position: number
}

export const Message = <T extends MessageContentType>({
  model: {
    type = MessageContentType.TextMarkdown,
    payload,
    direction,
    senderId,
    updatedAt
  },
  position
}: MessageProps<T>) => {
  type; // to avoid unused variable warning

  const { getUser } = useChat()

  const user = useMemo(() => {
    const user = getUser(senderId)
    return user
  }, [getUser, senderId])

  const containerClass = cn(
    "grow flex w-full px-4 py-px",
    "hover:bg-neutral-600/10",
    "message"
  )

  const messageClass = cn(
    "max-w-[min(80%,32rem)]",
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
        return <MessageHtmlContent html={payload.content as string} />
      case MessageContentType.Gallery:
        return <MessageGalleryContent items={payload.content as GalleryItem[]} />
      default:
        return (
          <div>{payload.content as string}</div>
        )
    }
  }, [type, payload])

  return (
    <div className={containerClass}>
      <div className={messageClass}>
        {/* Header */}
        {(position === 0 && direction === MessageDirection.Incoming) && (
          <div className="flex flex-col gap-1">
            <div className="text-xs text-neutral-400">{user?.username}</div>
          </div>
        )}
        {/* Content */}
        <div className="pr-14">
          {messageJsx}
        </div>
        {/* Footer */}
        <div>
          <div className="text-xs text-muted-foreground text-right -mt-3">{formatDate(updatedAt)}</div>
        </div>
      </div>
    </div>
  )
}

type MessageGroupProps = PropsWithChildren<{
  direction: MessageDirection,
  senderId: string
}>

export const MessageGroup: React.FC<MessageGroupProps> = ({
  direction,
  children,
  senderId
}) => {
  const { getUser } = useChat()

  const user = useMemo(() => {
    const user = getUser(senderId)
    return user
  }, [getUser, senderId])

  return (
    <section className={cn("relative", "message--group")}>
      {/* Avatar */}
      <ChatAvatar className={cn(
        "absolute top-0",
        {
          "left-4": direction === MessageDirection.Incoming,
          "right-4 hidden": direction === MessageDirection.Outgoing
        }
      )} src={user?.avatar} name={user?.username} />
      {/* Message */}
      <div className="flex flex-col w-full">
        {children}
      </div>
    </section>
  )
}