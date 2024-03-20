import { createContext } from "@/lib/context";
import { PropsWithChildren, useMemo, useState } from "react";

type LoadingStatus = "idle" | "loading" | "success" | "error"

type ChatUIContextValue = {
  conversationStatus: LoadingStatus;
  setConversationStatus: (status: LoadingStatus) => void;
}

const [useChatUI, ChatUIManager] = createContext<ChatUIContextValue>("ChatUIManager");


export const ChatUIProvider = ({ children }: PropsWithChildren) => {
  const [conversationStatus, setConversationStatus] = useState<LoadingStatus>("idle");

  const values = useMemo(() => ({
    conversationStatus,
    setConversationStatus
  }), [conversationStatus])

  return (
    <ChatUIManager {...values}>
      {children}
    </ChatUIManager>
  )
}

export { useChatUI }