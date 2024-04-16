import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ChatLoggedOut } from './ChatLoggedOut';
import { ChatImpl as Chat } from './Chat';
import { uuid } from '@/lib/uid';
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory, User } from '@chatscope/use-chat';
import { ChatService } from '../lib/chat-service';
import { ConversationData, UserData } from '../types';
import { seedStorage } from '../mock';
import { ChatUIProvider } from '../lib/provider';
import { useTypedChat } from '../hooks/useChat';
import { __DEV__ } from '../lib/const';
import { storage } from '@/lib/storage';
import { Room, Lobby } from '../components';
import { UploadProvider } from '../components/uploader/Uploader';

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => uuid();
const groupIdGenerator = () => uuid();

// Create serviceFactory
const serviceFactory: ChatServiceFactory<ChatService> = (storage, updateState) => {
  return new ChatService(storage, updateState);
};

const chatStorage = new BasicStorage<ConversationData>({ groupIdGenerator, messageIdGenerator });

if (__DEV__) {
  seedStorage(chatStorage);
} else {
  const user = storage.get('user') as User<UserData> | null
  if (user) {
    chatStorage.setCurrentUser(user)
  }
}

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

const Protected = () => {
  const { currentUser } = useTypedChat()

  if (!currentUser) {
    return <Navigate to="login" />
  }

  return <Outlet />
}

const Public = () => {
  const { currentUser } = useTypedChat()

  if (currentUser) {
    return <Navigate to="/" />
  }

  return <Outlet />

}

const ChatWrapper = () => (
  <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={chatConfig}>
    <ChatUIProvider>
      <UploadProvider>
        <main className="h-full flex border-t border-stroke-separator/50" style={variables as React.CSSProperties}>
          <Outlet />
        </main>
      </UploadProvider>
    </ChatUIProvider>
  </ChatProvider>
)

const ChatRoute = () => (
  <Routes>
    <Route element={<ChatWrapper />}>
      <Route element={<Protected />}>
        <Route path="/" element={<Chat />}>
          <Route index element={<Lobby />} />
          <Route path=":conversationId" element={<Room />} />
        </Route>
      </Route>
      <Route element={<Public />}>
        <Route path="login" element={<ChatLoggedOut />} />
      </Route>
    </Route>
  </Routes>
)

export { ChatRoute as Chat }