/* eslint-disable react-refresh/only-export-components */
import { createContext } from "@/lib/context";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";

export type LoadingStatus = "idle" | "loading" | "success" | "error"

type ChatUIContextValue = {
  conversationsStatus: LoadingStatus;
  setConversationsStatus: (status: LoadingStatus) => void;
  getConversationMessagesStatus: (conversationId: string) => LoadingStatus;
  setConversationMessagesStatus: (conversationId: string, status: LoadingStatus) => void;
}

const [useChatState, ChatStateManager] = createContext<ChatUIContextValue>("ChatUIManager");


const ChatStateProvider = ({ children }: PropsWithChildren) => {
  const [conversationsStatus, setConversationsStatus] = useState<LoadingStatus>("idle");
  const [conversationMessagesStatus, _setConversationMessagesStatus] = useState<Record<string, LoadingStatus>>({});

  const getConversationMessagesStatus = useCallback((conversationId: string) => {
    return conversationMessagesStatus[conversationId] ?? "idle"
  }, [conversationMessagesStatus])

  const setConversationMessagesStatus = useCallback((conversationId: string, status: LoadingStatus) => {
    _setConversationMessagesStatus((prev) => ({
      ...prev,
      [conversationId]: status
    }))
  }, [])

  const values = useMemo(() => ({
    conversationsStatus,
    setConversationsStatus,
    getConversationMessagesStatus,
    setConversationMessagesStatus
  }), [conversationsStatus, getConversationMessagesStatus, setConversationMessagesStatus])

  return (
    <ChatStateManager {...values}>
      {children}
    </ChatStateManager>
  )
}

export { useChatState, ChatStateProvider }
