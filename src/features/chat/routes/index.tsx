import { Outlet, Route, Routes } from 'react-router-dom';
import { ChatImpl as Chat } from './Chat';
import { uuid } from '@/lib/utils';
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory, Presence, User, UserStatus } from '@chatscope/use-chat';
import { ChatService } from '../lib/chat-service';
import { ConversationData, UserData } from '../types';
import { seedStorage } from '../mock';
import { ChatUIProvider } from '../lib/provider';
import { useTypedChat } from '../hooks/useChat';
import { __DEV__ } from '../lib/const';
import { storage } from '@/lib/storage';
import { Room, Lobby } from '../components';
import { UploadProvider } from '../components/uploader/Uploader';
import { useUser } from '@/lib/auth';
import { useEffect } from 'react';

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
  const { data } = useUser();
  const { setCurrentUser } = useTypedChat()

  useEffect(() => {
    if (data) {
      const currentUser = new User({
        id: data.id,
        presence: new Presence({ status: UserStatus.Available }),
        username: data.firstName,
        data: {}
      })
      storage.set('user', currentUser)
      setCurrentUser(currentUser)
    }
  }, [data, setCurrentUser])

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
    </Route>
  </Routes>
)

export { ChatRoute as Chat }