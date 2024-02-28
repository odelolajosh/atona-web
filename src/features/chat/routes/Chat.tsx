import { ChatRoom, ConversationList } from "@/features/chat/components";
import { ChatService } from "../lib/ChatService";
import { AutoDraft, BasicStorage, ChatProvider, ChatProviderConfig, ChatServiceFactory } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";
import { seedStorage } from "../mock";
import { uuid } from "@/lib/uid";

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
      <main className="h-full flex" style={variables as any}>
        <ConversationList />
        <ChatRoom />
      </main>
    </ChatProvider>
  )
}