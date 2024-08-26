/* eslint-disable react-refresh/only-export-components */
import { createContext } from "@/lib/context";
import { useLocalStorage } from "@/lib/hooks/use-storage";
import { Conversation } from "@chatscope/use-chat";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { ConversationData } from "../types";
import { useChat } from "../hooks/use-chat";

export type LoadingStatus = "idle" | "loading" | "success" | "error"

type SecondaryChatContextValue = {
  conversationsStatus: LoadingStatus;
  setConversationsStatus: (status: LoadingStatus) => void;
  getConversationMessagesStatus: (conversationId: string) => LoadingStatus;
  setConversationMessagesStatus: (conversationId: string, status: LoadingStatus) => void;
  temporaryConversation: Conversation<ConversationData>[];
  addTemporaryConversation: (conversation: Conversation<ConversationData>) => void;
  removeTemporaryConversation: (conversationId: string) => void;
}

const [useSecondaryChat, SecondaryChatManager] = createContext<SecondaryChatContextValue>("SecondaryChatManager");

const SecondaryChatProvider = ({ children }: PropsWithChildren) => {
  const [conversationsStatus, setConversationsStatus] = useState<LoadingStatus>("idle");
  const [conversationMessagesStatus, _setConversationMessagesStatus] = useState<Record<string, LoadingStatus>>({});
  const { addConversation } = useChat();
  const [temporaryConversation, setTemporaryConversations] = useLocalStorage<Conversation<ConversationData>[]>("temporary_conversations", []);

  const getConversationMessagesStatus = useCallback((conversationId: string) => {
    return conversationMessagesStatus[conversationId] ?? "idle"
  }, [conversationMessagesStatus])

  const setConversationMessagesStatus = useCallback((conversationId: string, status: LoadingStatus) => {
    _setConversationMessagesStatus((prev) => ({
      ...prev,
      [conversationId]: status
    }))
  }, [])

  const addTemporaryConversation = useCallback((conversation: Conversation<ConversationData>) => {
    addConversation(conversation)
    setTemporaryConversations((prev) => [...prev, conversation])
  }, [addConversation, setTemporaryConversations])

  const removeTemporaryConversation = useCallback((conversationId: string) => {
    // removeConversation(conversationId)
    setTemporaryConversations((prev) => prev.filter((c) => c.id !== conversationId))
  }, [setTemporaryConversations])

  const values = useMemo(() => ({
    conversationsStatus,
    setConversationsStatus,
    getConversationMessagesStatus,
    setConversationMessagesStatus,
    temporaryConversation,
    addTemporaryConversation,
    removeTemporaryConversation
  }), [addTemporaryConversation, conversationsStatus, getConversationMessagesStatus, removeTemporaryConversation, setConversationMessagesStatus, temporaryConversation])

  return (
    <SecondaryChatManager {...values}>
      {children}
    </SecondaryChatManager>
  )
}

export { useSecondaryChat, SecondaryChatProvider }
