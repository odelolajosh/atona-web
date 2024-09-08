import "../chat.css";
import { ConversationList } from "@/features/chat/components";
import { ConnectionState, ConnectionStateChangedEvent, MessageEvent, Presence, UserStatus } from "@chatscope/use-chat";
import { useEffect } from "react";
import { ConversationJoinedEvent, MessageReadEvent } from "../lib/events";
import { useChat } from "../hooks/use-chat";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLoadConversation } from "../hooks/use-load-conversations";
import { useChatEventListener } from "../hooks/use-chat-event-listener";
import { showLocalNotification } from "@/lib/service";

export const Chat = () => {
  const { conversationId } = useParams();
  const { currentUser, service, addConversation, updateState, getConversation, activeConversation, setActiveConversation, removeConversation, readUnreadMessages, getUser } = useChat("Chat");
  const navigate = useNavigate()

  useLoadConversation("Chat")

  useChatEventListener("Chat", "connectionStateChanged", (event: ConnectionStateChangedEvent) => {
    if (!currentUser) return
    currentUser.presence = new Presence({
      status: event.status === ConnectionState.Connected ? UserStatus.Available : UserStatus.Away
    })
    updateState()
  });

  useChatEventListener("Chat", "conversationJoined", (event: ConversationJoinedEvent) => {
    // handle temporary conversations here
    // if this conversation is dm and it exists as temporary conversation
    // remove it from temporary conversations

    if (!currentUser) return
    if (event.conversation.data?.type === "dm") {
      const otherUser = event.conversation.participants.find((p) => p.id !== currentUser.id)
      const temporaryConversation = getConversation(`t_${otherUser?.id}`)
      if (temporaryConversation) {
        if (activeConversation?.id === temporaryConversation.id) {
          navigate(`/chat/${event.conversation.id}`, { replace: true })
          setActiveConversation(event.conversation.id)
        }
        removeConversation(temporaryConversation.id, true) // true, clear messages too
      }
    }
    addConversation(event.conversation)
  });

  useChatEventListener("Chat", "messageRead", (event: MessageReadEvent) => {
    readUnreadMessages(event.conversation.id)
  });

  useChatEventListener("Chat", "message", (event: MessageEvent) => {
    // open notification if conversation is not active
    if (event.conversationId !== activeConversation?.id) {
      const conversation = getConversation(event.conversationId)
      if (!conversation) return

      const otherParticipant = conversation.participants.find((p) => p.id !== currentUser?.id)
      if (!otherParticipant) return

      const otherUser = getUser(otherParticipant.id)
      if (!otherUser) return

      showLocalNotification(
        "New Message", 
        `${otherUser.username} sent you a message`,
        { redirectUrl: `/chat/${event.conversationId}` }
      )
    }
  });

  useEffect(() => {
    if (!currentUser) return
    service.connect(currentUser.id)
  }, [currentUser, service])

  return (
    <div className="flex h-full">
      <ConversationList className={cn("transition-width duration-75", {
        "w-full md:w-[var(--chat-list-width)]": !conversationId,
        "w-0 overflow-hidden md:w-[var(--chat-list-width)]": conversationId
      })} />
      <div className={cn("w-full md:flex-1", {
        "hidden md:block": !conversationId
      })}>
        <Outlet />
      </div>
    </div >
  )
}