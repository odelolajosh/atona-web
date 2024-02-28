import { AddConversationModal, ChatRoom, ConversationList } from "@/features/chat/components";
import { ChatService } from "../lib/ChatService";
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory, ConnectionState, ConnectionStateChangedEvent, Conversation, Participant, Presence, User, UserStatus } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";
import { seedStorage } from "../mock";
import { uuid } from "@/lib/uid";
import { useEffect } from "react";
import { storage } from "@/lib/storage";
import { ConversationJoinedEvent } from "../lib/events";
import chatAPI from "../lib/api";
import { ChatLoggedOut } from "./ChatLoggedOut";
import { useTypedChat } from "../hooks/useChat";
import { ChatUIProvider } from "../lib/provider";

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => uuid();
const groupIdGenerator = () => uuid();

// Create serviceFactory
const serviceFactory: ChatServiceFactory<ChatService<ConversationData, UserData>> = (storage, updateState) => {
  return new ChatService(storage, updateState);
};

const chatStorage = new BasicStorage<ConversationData>({ groupIdGenerator, messageIdGenerator });

seedStorage(chatStorage);

const chatConfig: ChatProviderConfig = {
  typingThrottleTime: 250,
  typingDebounceTime: 900,
  debounceTyping: true,
  autoDraft: AutoDraft.Save | AutoDraft.Restore
}

const variables = {
  "--chat-header-height": "66px",
  "--chat-list-width": "350px",
} as const

export function Chat() {
  return (
    <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={chatConfig}>
      <ChatUIProvider>
        <main className="h-full flex" style={variables as any}>
          <ChatImpl />
        </main>
      </ChatUIProvider>
    </ChatProvider>
  )
}

const ChatImpl = () => {
  const { currentUser, setCurrentUser, service, addUser, addConversation, setConversationLoading, removeAllUsers, removeAllConversations, showAddConversation, setShowAddConversation } = useTypedChat()

  useEffect(() => {
    const user = storage.get('user') as User<UserData> | null
    if (!user) return
    setCurrentUser(user)
  }, [])

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

    setConversationLoading(true)
    loadConversation(currentUser.id)
      .catch((err) => {
        console.error("Conversation did not load", err)
      })
      .finally(() => {
        setConversationLoading(false)
        console.log("Conversation is loaded")
      })

    service.on("connectionStateChanged", onConnectionStateChanged)
    service.on("conversationJoined", onConversationJoined)

    return () => {
      service.off("connectionStateChanged", onConnectionStateChanged)
      service.off("conversationJoined", onConversationJoined)
    }
  }, [currentUser])

  const setUp = async (userId: string) => {
    console.log('setting up', userId)
  }

  const loadConversation = async (userId: string) => {
    const result: any[] = await Promise.all([
      chatAPI.get('/users'),
      chatAPI.get(`/users/${userId}/chatrooms`)
    ])

    const users = result[0].users as any[]
    const conversations = result[1].chatRooms as any[]

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
        avatar: user.avatar,
        data: {}
      })
      addUser(newUser)
    })

    conversations.forEach((conversation) => {
      const participants = conversation.users.map((u: any) => {
        return new Participant({ id: u.uuid })
      })

      const newConversation = new Conversation({
        id: conversation.uuid,
        participants,
        data: {} as ConversationData
      })

      addConversation(newConversation)
    })
  }

  if (!currentUser) return <ChatLoggedOut onLogin={setUp} />
  return (
    <>
      <ConversationList />
      <ChatRoom />
      <AddConversationModal open={showAddConversation} onOpenChange={(open) => !open && setShowAddConversation(open)} />
    </>
  )
}