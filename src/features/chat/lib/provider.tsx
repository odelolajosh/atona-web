import { uuid } from '@/lib/utils';
import { AutoDraft, ChatProvider as BaseChatProvider, ChatProviderConfig, ChatServiceFactory, Presence, User, UserStatus } from '@chatscope/use-chat';
import { ChatService } from './chat-service';
import { ConversationData } from '../types';
import { SecondaryChatProvider } from './secondary-chat';
import { useChat } from '../hooks/use-chat';
import { PropsWithChildren, useEffect } from 'react';
import { useToken, useUser } from '@/lib/auth';
import chatAPI from './api';
import { ChatStorage } from './chat-storage';


// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('ServiceWorker registered with scope:', registration.scope);
    })
    .catch(err => {
      console.log('ServiceWorker registration failed:', err);
    });
}


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

const ChatAuthenticator = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>
}

const ChatProvider = ({ children }: PropsWithChildren) => (
  <BaseChatProvider serviceFactory={serviceFactory} storage={chatStorage} config={chatConfig}>
    <SecondaryChatProvider>
      <ChatAuthenticator>
        {children}
      </ChatAuthenticator>
    </SecondaryChatProvider>
  </BaseChatProvider>
)

export { ChatProvider }
