import { Conversation as TConversation, UserStatus } from "@chatscope/use-chat"
import { useChat } from "../../hooks/use-chat"
import { ConversationData } from "../../types"
import { cn } from "@/lib/utils"
import { ChatAvatar } from "../chat-avatar"
import { getConversationMeta, useConversation } from "../../hooks/use-conversation"
import { Link, useNavigate } from "react-router-dom"
import { Spinner } from "@/components/icons/spinner"
import { Input } from "@/components/ui/input"
import { useChatState } from "../../lib/provider"
import { useUser } from "@/lib/auth"
import { useMemo, useRef, useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { JoinConversationModal } from "./join-conversation-modal"
import { useModal } from "@/lib/hooks/use-modal"
import { useDebouncedCallback } from 'use-debounce';
import { useChatSearch } from "../../hooks/use-chat-api"
import { Cross2Icon } from "@radix-ui/react-icons"

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

const SearchItem = ({ user }: { user: { id: string, name: string, avatar?: string } }) => {
  const { currentUser, activeConversation, service, conversations } = useChat()
  const { openModal, modal, modalProps } = useModal<'new-conversation'>();
  const navigate = useNavigate()

  const handleClick = () => {
    // We don't want to open a conversation with ourselves, except we want to add that feature
    if (user.id === currentUser?.id) return
    // TODO: can be optimized
    // check if there is already a conversation with this user
    const existingConversation = conversations.find(c => c.data?.type === "dm" && c.participants.some(p => p.id === user.id))
    if (existingConversation) {
      navigate(`/chat/${existingConversation.id}`)
    } else {
      service.createConversation([currentUser!.id, user.id])
      openModal('new-conversation', user.id)
      // navigate(`/chat/${user.id}`)
    }
  }

  return (
    <>
      <div className={cn(
        "flex gap-4 items-center px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-muted/50",
        {
          "bg-muted hover:bg-muted text-muted-foreground hover:text-muted-foreground": activeConversation?.id === user.id
        }
      )} onClick={handleClick}>
        <ChatAvatar src={user.avatar} name={user.name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="text-white font-medium">{user.name}</div>
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
  const { conversations, getUser, currentUser } = useChat()
  const { conversationsStatus } = useChatState("ConversationList")
  const searchRef = useRef<HTMLInputElement>(null)

  const [q, setQ] = useState("");

  const { data: searchResult, status: searchStatus } = useChatSearch(q);

  const filteredConversations = useMemo(() => {
    if (q === "" || !currentUser) {
      return conversations
    }

    const query = q.toLowerCase()

    const filteredConversations: TConversation<ConversationData>[] = []
    const dms: string[] = []

    conversations.forEach((c) => {
      const { name } = getConversationMeta(c, currentUser.id, getUser)
      if (c.data?.type === "dm") {
        const otherUser = c.participants.find((p) => p.id !== currentUser.id)
        if (!otherUser) return
        dms.push(otherUser.id)
      }
      if (name.toLowerCase().includes(query)) {
        filteredConversations.push(c)
      }
    })

    return filteredConversations
  }, [q, conversations, currentUser, getUser])

  const handleSearch = useDebouncedCallback((term) => {
    setQ(term)
  }, 300)

  const clearSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = ""
      setQ("")
    }
  }

  return (
    <div className={cn("w-full flex flex-col relative", className)}>
      <div className="py-4 px-6">
        <div className="relative">
          <Input ref={searchRef} type="text" placeholder="Search..." autoComplete="off" onChange={(e) => handleSearch(e.target.value)} />
          {q && (
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
              <Cross2Icon className="w-4 h-4 text-muted-foreground" onClick={clearSearch} />
            </span>
          )}
        </div>
      </div>
      {conversationsStatus === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2" style={{ scrollbarWidth: "none" }}>
          <div className="space-y-2">
            {(q && filteredConversations.length > 0) ? (
              <div className="text-muted-foreground text-sm px-4 py-2">
                From your conversations
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
            {q && (
              <>
                {searchResult && searchResult?.length > 0 && (
                  <div className="text-muted-foreground text-sm px-4 py-2">
                    From naerospace
                  </div>
                )}
                {searchStatus === "pending" ? (
                  <div className="flex justify-center items-center h-10">
                    <Spinner />
                  </div>
                ) : searchResult?.length === 0 ? (
                  <div className="text-muted-foreground text-sm px-4 py-2">
                    No results found for <span className="font-medium">{q}</span>
                  </div>
                ) : searchResult?.map((user) => <SearchItem key={user.id} user={user} />)}
              </>
            )}

          </div>
          {/* <div className="space-y-2">
              {(q && filteredConversations.length === 0) ? (
                <div className="text-muted-foreground text-sm px-4 py-2">
                  No results found for <span className="font-medium">{q}</span>
                </div>
              ) : null}
            </div> */}
        </div>
      )}
      <div className="p-2 mt-auto flex gap-2 justify-between items-center">
        <div className="flex flex-col gap-px items-center">
          <span className="relative">
            <ChatAvatar name={user?.username} src={user?.avatarUrl} />
            <span className={cn("absolute bottom-0 right-0 rounded-full w-3 h-3 bg-orange-500", {
              "bg-green-500": currentUser?.presence.status === UserStatus.Available,
            })}></span>
          </span>
          <span className="text-muted-foreground text-sm">
            {currentUser?.presence.status === UserStatus.Available ? "online" : "offline"}
          </span>
        </div>

        {/* Floating button */}
        {/* <NewGroupModal>
          <Button className="gap-2" size="lg">
            <Pencil2Icon /> New group
          </Button>
        </NewGroupModal> */}
      </div>
    </div >
  )
}