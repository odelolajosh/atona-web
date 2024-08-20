import { Conversation as TConversation, User, UserStatus } from "@chatscope/use-chat"
import { useChat } from "../../hooks/use-chat"
import { ConversationData, UserData } from "../../types"
import { cn } from "@/lib/utils"
import { ChatAvatar } from "../chat-avatar"
import { getConversationMeta, useConversation } from "../../hooks/use-conversation"
import { Link } from "react-router-dom"
import { Spinner } from "@/components/icons/spinner"
import { Input } from "@/components/ui/input"
import { usePresence } from "../../hooks/use-presence"
import { useChatState } from "../../lib/provider"
import { useUser } from "@/lib/auth"
import { useMemo, useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { JoinConversationModal } from "./join-conversation-modal"
import { useModal } from "@/lib/hooks/use-modal"

type ConversationProps = {
  conversation: TConversation<ConversationData>
}

const Conversation = ({ conversation: c }: ConversationProps) => {
  const { activeConversation } = useChat()
  const { name, avatar } = useConversation(c.id)

  return (
    <Slot className={cn(
      "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-muted/50",
      {
        "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground": activeConversation?.id === c.id
      }
    )}>
      <Link to={`/chat/${c.id}`}>
        <ChatAvatar src={avatar} name={name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="text-white font-medium">{name}</div>
        </div>
      </Link>
    </Slot>
  )
}

const UserConversation = ({ user }: { user: User<UserData> }) => {
  const { activeConversation, service } = useChat()
  const { username: name, avatar } = user
  const { openModal, modal, modalProps } = useModal<'new-conversation'>();

  const handleClick = () => {
    service.createConversation([user.id])
    openModal('new-conversation', user.id)
    // navigate(`/chat/${user.id}`)
  }

  return (
    <>
      <div className={cn(
        "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-muted/50",
        {
          "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground": activeConversation?.id === user.id
        }
      )} onClick={handleClick}>
        <ChatAvatar src={avatar} name={name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="text-white font-medium">{name}</div>
        </div>
      </div>
      {(modal?.type === 'new-conversation' && modal?.data) ? (
        <JoinConversationModal {...modalProps('new-conversation')} to={modal.data as string} />
      ) : null}
    </>
  )
}

export const ConversationList = ({ className }: { className?: string }) => {
  const { data: user } = useUser()
  const { conversations, users, getUser, currentUser } = useChat()
  const { conversationsStatus } = useChatState("ConversationList")
  const presence = usePresence()

  const [q, setQ] = useState("");

  const [filteredConversations, filteredUsers] = useMemo(() => {
    if (q === "") {
      return [conversations, []]
    }

    const query = q.toLowerCase()


    if (!currentUser) return [[], []]

    const filteredConversations: TConversation<ConversationData>[] = []
    const dms: string[] = []

    conversations.forEach((c) => {
      const { name } = getConversationMeta(c, currentUser?.id, getUser)
      if (c.data?.type === "dm") {
        const otherUser = c.participants.find((p) => p.id !== currentUser.id)
        if (!otherUser) return
        dms.push(otherUser.id)
      }
      if (name.toLowerCase().includes(query)) {
        filteredConversations.push(c)
      }
    })

    const filteredUsers = users.filter((u) => {
      if (u.id === currentUser.id) return false
      if (dms.includes(u.id)) return false
      return u.username.toLowerCase().includes(query)
    })

    return [filteredConversations, filteredUsers]
  }, [q, conversations, users, currentUser, getUser])

  return (
    <div className={cn("w-full flex flex-col relative", className)}>
      <div className="py-4 px-6">
        <Input type="text" placeholder="Search..." autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {conversationsStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2" style={{ scrollbarWidth: "none" }}>
            <div className="space-y-2">
              {(q && filteredConversations.length > 0) ? (
                <div className="text-muted-foreground text-sm px-4 py-2">
                  Results from your conversations
                </div>
              ) : (!q && filteredConversations.length === 0) ? (
                <div className="text-muted-foreground text-base px-4 py-2">
                  No conversations yet.
                </div>
              ) : null}
              <div className="flex flex-col gap-1">
                {filteredConversations.map((c) => <Conversation key={c.id} conversation={c} />)}
              </div>
            </div>
            <div className="space-y-2">
              {(q && filteredUsers.length > 0) ? (
                <div className="text-muted-foreground text-sm px-4 py-2">
                  Results from naerospace
                </div>
              ) : null}
              <div className="flex flex-col gap-1">
                {filteredUsers.map((u) => <UserConversation key={u.id} user={u} />)}
              </div>
            </div>
            <div className="space-y-2">
              {(q && filteredUsers.length === 0 && filteredConversations.length === 0) ? (
                <div className="text-muted-foreground text-sm px-4 py-2">
                  No results found for <span className="font-medium">{q}</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="p-2 flex gap-2 justify-between items-center">
            <div className="flex flex-col gap-px items-center">
              <span className="relative">
                <ChatAvatar name={user?.username} src={user?.avatarUrl} />
                <span className={cn("absolute bottom-0 right-0 rounded-full w-3 h-3 bg-orange-500", {
                  "bg-green-500": presence === UserStatus.Available,
                })}></span>
              </span>
              <span className="text-muted-foreground text-sm">
                {presence === UserStatus.Available ? "Online" : "Offline"}
              </span>
            </div>

            {/* Floating button */}
            {/* <NewGroupModal>
              <Button className="gap-2" size="lg">
                <Pencil2Icon /> New group
              </Button>
            </NewGroupModal> */}
          </div>
        </>
      )}
    </div>
  )
}