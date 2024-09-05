import { Outlet } from 'react-router-dom';
import { uuid } from '@/lib/utils';
import { AutoDraft, ChatProvider, ChatProviderConfig, ChatServiceFactory, Presence, User, UserStatus } from '@chatscope/use-chat';
import { ChatService } from '../lib/chat-service';
import { ConversationData } from '../types';
import { SecondaryChatProvider } from '../lib/provider';
import { useChat } from '../hooks/use-chat';
import { UploadProvider } from '../components/uploader/uploader';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToken, useUser } from '@/lib/auth';
import { Spinner } from '@/components/icons/spinner';
import chatAPI from '../lib/api';
import { ChatStorage } from '../lib/chat-storage';

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => uuid();
const groupIdGenerator = () => uuid();

// Create serviceFactory
const serviceFactory: ChatServiceFactory<ChatService> = (storage, updateState) => {
  return new ChatService(storage, updateState);
};

const chatStorage = new ChatStorage<ConversationData>({ groupIdGenerator, messageIdGenerator });

// if (__DEV__) {
//   seedStorage(chatStorage);
// }

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
  const { data, status } = useUser();
  const { addUser, setCurrentUser, getUser } = useChat("AuthenticatedChat");
  useToken(chatAPI.client);

  useEffect(() => {
    if (data && status === "success") {
      const currentUser = new User({
        id: data.id,
        presence: new Presence({ status: UserStatus.Unavailable }),
        username: data.username,
        data: {}
      })
      addUser(currentUser)
      setCurrentUser(currentUser)
    }
  }, [addUser, data, getUser, setCurrentUser, status])

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Failed to load user data</p>
      </div>
    )
  }

  return <>{children}</>
}

const ChatWrapper = () => (
  <ChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={chatConfig}>
    <SecondaryChatProvider>
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
    </SecondaryChatProvider>
  </ChatProvider>
)

export { ChatWrapper }