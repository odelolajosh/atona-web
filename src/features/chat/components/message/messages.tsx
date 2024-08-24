import { PropsWithChildren, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import { Message, MessageGroup as MsgGroup } from "./message"
import { MessageGroup } from "@chatscope/use-chat/dist/MessageGroup"
import { cn } from "@/lib/utils"

type MessageListProps = PropsWithChildren<{
  className?: string
}>

type ListSnapshot = {
  lastClientHeight: number
  preventScrollTop: boolean // prevent scroll to top when container is resized
  resizeObserver?: ResizeObserver
  lastMessage?: Element | null
  lastMessageGroup?: Element | null
  sticky?: boolean // whether the list is sticked to the bottom
  noScroll?: boolean // whether the list should not be scrolled
  scrollTicking?: boolean
  resizeTicking?: boolean
}

export type MessageListRef = {
  mount: () => void
}

export const MessageList = forwardRef<MessageListRef, MessageListProps>(({ children, className }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrolledRef = useRef<HTMLDivElement>(null)
  const scrollToRef = useRef<HTMLDivElement>(null)

  // store the scroll position and other related data in ref
  const snapshotRef = useRef<ListSnapshot>({
    lastClientHeight: 0,
    preventScrollTop: false,
  })

  const handleScroll = useCallback(() => {
    const snapshot = snapshotRef.current

    if (!snapshot.scrollTicking) {
      window.requestAnimationFrame(() => {
        if (snapshot.noScroll === false) {
          snapshot.preventScrollTop = isSticked();
        } else {
          snapshot.noScroll = false;
        }

        snapshot.scrollTicking = false;
      })

      snapshot.scrollTicking = true
    }
  }, [])

  const mount = useCallback(() => {
    scrollToEnd("auto")

    const list = containerRef.current!
    const snapshot = snapshotRef.current!

    containerRef.current!.addEventListener("scroll", handleScroll)
    snapshot.resizeObserver = new ResizeObserver(handleResize)
    snapshot.resizeObserver.observe(list)

    return () => {
      list.removeEventListener("scroll", handleScroll)
      snapshot.resizeObserver?.disconnect()
    }
  }, [handleScroll]);

  const captureSnapshot = useCallback(() => {
    const list = containerRef.current
    if (!list) return

    const sticky = list.scrollHeight - list.scrollTop - list.clientHeight < 1
    const [lastMessage, lastMessageGroup] = getLastMessageAndGroup()

    snapshotRef.current = {
      lastClientHeight: list.clientHeight,
      preventScrollTop: !sticky,
      lastMessage,
      lastMessageGroup,
      sticky,
    }
  }, [])

  useEffect(() => {
    mount()
  }, [mount])

  useEffect(() => {
    const snapshot = snapshotRef.current!

    if (snapshot.sticky) {
      scrollToEnd("smooth")
      snapshot.preventScrollTop = true;
    }

    captureSnapshot()
  }, [captureSnapshot, children])

  useImperativeHandle(ref, () => {
    return {
      mount
    }
  })

  const handleResize = () => {
    const snapshot = snapshotRef.current
    if (snapshot.resizeTicking === false) {
      window.requestAnimationFrame(() => {
        const list = containerRef.current;

        if (list) {
          const currentHeight = list.clientHeight;
          const diff = currentHeight - snapshot.lastClientHeight;

          if (diff >= 1) {
            if (!snapshot.preventScrollTop) {
              list.scrollTop = Math.round(list.scrollTop) - diff;
            }
          } else {
            list.scrollTop = list.scrollTop - diff;
          }

          snapshot.lastClientHeight = list.clientHeight;
        }

        snapshot.resizeTicking = false;
      });

      snapshot.resizeTicking = true;
    }
  }

  const isSticked = () => {
    const list = containerRef.current!
    return Math.round(list.scrollHeight - list.scrollTop - list.clientHeight) < 1
  }

  const getLastMessageAndGroup = () => {
    // last message group is the last with class message--group
    const lastMessageGroup = containerRef.current?.querySelector(".message--group:last-child")
    const lastMessage = lastMessageGroup?.querySelector(".message:last-child")
    return [lastMessage, lastMessageGroup]
  }

  const scrollToEnd = (scrollBehavior: ScrollBehavior = "smooth") => {
    const list = containerRef.current!;
    const scrollTo = scrollToRef.current!;

    // https://stackoverflow.com/a/45411081/6316091
    const parentRect = list!.getBoundingClientRect();
    const childRect = scrollTo.getBoundingClientRect();

    // Scroll by offset relative to parent
    const scrollOffset = childRect.top + list.scrollTop - parentRect.top;

    if (list.scrollBy) {
      list.scrollBy({ top: scrollOffset, behavior: scrollBehavior });
    } else {
      list.scrollTop = scrollOffset;
    }

    snapshotRef.current.lastClientHeight = list.clientHeight;
    snapshotRef.current.noScroll = true;
  }

  return (
    <div className={cn("overflow-y-auto overflow-x-hidden overscroll-none relative", className)} ref={containerRef}>
      <div className="flex flex-col justify-end gap-1" ref={scrolledRef}>
        {children}
        <div ref={scrollToRef}></div>
      </div>
    </div>
  )
})

type MessagesProps = PropsWithChildren<{
  messages: MessageGroup[]
}>

export const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <>
      {messages.map((g, index) => {
        return (
          <MsgGroup key={index} direction={g.direction} senderId={g.senderId}>
            {g.messages.map((m, index) => {
              return (
                <Message key={index} model={{
                  senderId: m.senderId,
                  type: m.contentType,
                  payload: m.content,
                  direction: m.direction,
                  updatedAt: m.createdTime,
                  status: m.status
                }} position={index} />
              )
            })}
          </MsgGroup>
        )
      })}
    </>
  )
}