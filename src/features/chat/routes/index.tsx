import { Outlet, Route, Routes } from 'react-router-dom';
import { ChatImpl as Chat } from './chat';
import { uuid } from '@/lib/utils';
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory, Presence, User, UserStatus } from '@chatscope/use-chat';
import { ChatService } from '../lib/chat-service';
import { ConversationData, UserData } from '../types';
import { seedStorage } from '../mock';
import { ChatUIProvider } from '../lib/provider';
import { useChat } from '../hooks/use-chat';
import { __DEV__ } from '../lib/const';
import { storage } from '@/lib/storage';
import { Room, Lobby } from '../components';
import { UploadProvider } from '../components/uploader/uploader';
import { useUser } from '@/lib/auth';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

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
  const { setCurrentUser } = useChat()

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
        <main className="h-full flex" style={variables as React.CSSProperties}>
          <Helmet>
            <title>Chat - Atona GCS</title>
          </Helmet>
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