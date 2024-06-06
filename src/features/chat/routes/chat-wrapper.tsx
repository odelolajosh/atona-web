import { Outlet } from 'react-router-dom';
import { uuid } from '@/lib/utils';
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory, Presence, User, UserStatus } from '@chatscope/use-chat';
import { ChatService } from '../lib/chat-service';
import { ConversationData } from '../types';
import { seedStorage } from '../mock';
import { ChatStateProvider } from '../lib/provider';
import { useChat } from '../hooks/use-chat';
import { __DEV__ } from '../lib/const';
import { UploadProvider } from '../components/uploader/uploader';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useChatUser } from '../hooks/use-chat-api';

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
}

const chatConfig: ChatProviderConfig = {
  typingThrottleTime: 250,
  typingDebounceTime: 900,
  debounceTyping: true,
  autoDraft: AutoDraft.Save | AutoDraft.Restore
}

const variables = {
  "--chat-header-height": "4rem",
  "--chat-list-width": "350px",
} as const

const AuthenticatedChat = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useChatUser();
  const { setCurrentUser } = useChat()

  useEffect(() => {
    if (data && status === "success") {
      const currentUser = new User({
        id: data.userId,
        presence: new Presence({ status: UserStatus.Available }),
        username: data.name,
        data: {}
      })
      setCurrentUser(currentUser)
    }
  }, [data, status, setCurrentUser])

  if (status === "pending") {
    return <div>Loading...</div>
  } else if (status === "error") {
    return <div>Error</div>
  } else {
    return <>{children}</>
  }
}

const ChatWrapper = () => (
  <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={chatConfig}>
    <ChatStateProvider>
      <UploadProvider>
        <main className="h-full" style={variables as React.CSSProperties}>
          <Helmet>
            <title>Chat - Atona GCS</title>
          </Helmet>
          <AuthenticatedChat>
            <Outlet />
          </AuthenticatedChat>
        </main>
      </UploadProvider>
    </ChatStateProvider>
  </ChatProvider>
)

export { ChatWrapper }