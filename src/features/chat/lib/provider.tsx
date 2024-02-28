import { createContext } from "@/lib/context";
import { PropsWithChildren, useState } from "react";

type ChatUIContextValue = {
  conversationLoading: boolean
  setConversationLoading: (loading: boolean) => void
  showAddConversation: boolean
  setShowAddConversation: (show: boolean) => void
}

const [useChatUI, ChatUIManager] = createContext<ChatUIContextValue>("ChatUIManager");

export const ChatUIProvider = ({ children }: PropsWithChildren) => {
  const [conversationLoading, setConversationLoading] = useState(false);
  const [showAddConversation, setShowAddConversation] = useState(false);

  return (
    <ChatUIManager {...{ conversationLoading, setConversationLoading, showAddConversation, setShowAddConversation }}>
      {children}
    </ChatUIManager>
  )
}

export { useChatUI }