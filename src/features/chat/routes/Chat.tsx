import "../chat.css";
import { ConversationList } from "@/features/chat/components";
import { ConnectionState, ConnectionStateChangedEvent, Conversation, Participant, Presence, User, UserStatus } from "@chatscope/use-chat";
import { ConversationData } from "../types";
import { useCallback, useEffect } from "react";
import { ConversationJoinedEvent } from "../lib/events";
import chatAPI from "../lib/api";
import { useTypedChat } from "../hooks/useChat";
import { __DEV__ } from "../lib/const";
import { Outlet } from "react-router-dom";
import { ChatAPI } from "../lib/types";

export const ChatImpl = () => {
  const { currentUser, service, addUser, addConversation, conversationStatus, setConversationStatus, removeAllUsers, removeAllConversations } = useTypedChat()

  const loadConversation = useCallback(async (userId: string) => {
    if (__DEV__) return;
    
    if (conversationStatus !== "idle") return;

    setConversationStatus("loading")
    try {
      const result = await Promise.all([
        chatAPI.getUsers(),
        chatAPI.getConversations(userId)
      ])

      if (!result[0] || !result[1]) return

      const [users, conversations] = result;

      // remove all existing users
      removeAllUsers()
      removeAllConversations()

      users.forEach((user) => {
        const newUser = new User({
          id: user.uuid,
          presence: new Presence({
            status: user.online ? UserStatus.Available : UserStatus.Away
          }),
          username: user.name,
          avatar: user.avatarUrl,
          data: {}
        })
        addUser(newUser)
      })

      conversations.forEach((conversation: ChatAPI.Conversation) => {
        const participants = conversation.users.map((u) => {
          return new Participant({ id: u.uuid })
        })

        const newConversation = new Conversation({
          id: conversation.uuid,
          participants,
          data: {
            name: conversation.name,
            type: conversation.chatRoomType === 0 ? "dm" : "group"
          } as ConversationData
        })

        addConversation(newConversation)
      })
      setConversationStatus("success")
    } catch (err) {
      console.error("Failed to load conversation", err)
      setConversationStatus("error")
    }
  }, [addConversation, addUser, removeAllConversations, removeAllUsers, conversationStatus, setConversationStatus])

  useEffect(() => {
    if (!currentUser) return

    const onConnectionStateChanged = (event: ConnectionStateChangedEvent) => {
      currentUser.presence = new Presence({
        status: event.status === ConnectionState.Connected ? UserStatus.Available : UserStatus.Away
      })
    }

    const onConversationJoined = (event: ConversationJoinedEvent) => {
      addConversation(event.conversation)
    }

    service.connect(currentUser.id)

    loadConversation(currentUser.id)

    service.on("connectionStateChanged", onConnectionStateChanged)
    service.on("conversationJoined", onConversationJoined)

    return () => {
      service.off("connectionStateChanged", onConnectionStateChanged)
      service.off("conversationJoined", onConversationJoined)
    }
  }, [addConversation, currentUser, loadConversation, service])

  return (
    <>
      <ConversationList />
      <Outlet />
      {/* <AddConversationModal open={showAddConversation} onOpenChange={(open) => !open && setShowAddConversation(open)} /> */}
    </>
  )
}