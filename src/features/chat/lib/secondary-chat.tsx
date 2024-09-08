/* eslint-disable react-refresh/only-export-components */
import { createContext } from "@/lib/context";
import { ChatMessage, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";

export type LoadingStatus = "idle" | "loading" | "success" | "error"

type SecondaryChatContextValue = {
  // Conversation loading states
  conversationsStatus: LoadingStatus;
  setConversationsStatus: (status: LoadingStatus) => void;
  getConversationMessagesStatus: (conversationId: string) => LoadingStatus;
  setConversationMessagesStatus: (conversationId: string, status: LoadingStatus) => void;
  // Unread messages
  addUnreadMessage: (conversationId: string, message: ChatMessage<MessageContentType>) => void;
  getUnreadMessages: (conversationId: string) => ChatMessage<MessageContentType>[];
  readUnreadMessages: (conversationId: string) => void;
}

const [useSecondaryChat, SecondaryChatManager] = createContext<SecondaryChatContextValue>("SecondaryChatManager");

const SecondaryChatProvider = ({ children }: PropsWithChildren) => {
  const [conversationsStatus, setConversationsStatus] = useState<LoadingStatus>("idle");
  const [conversationMessagesStatus, _setConversationMessagesStatus] = useState<Record<string, LoadingStatus>>({});


  const [unreadMessages, setUnreadMessages] = useState<Record<string, ChatMessage<MessageContentType>[]>>({})

  const getConversationMessagesStatus = useCallback((conversationId: string) => {
    return conversationMessagesStatus[conversationId] ?? "idle"
  }, [conversationMessagesStatus])

  const setConversationMessagesStatus = useCallback((conversationId: string, status: LoadingStatus) => {
    _setConversationMessagesStatus((prev) => ({
      ...prev,
      [conversationId]: status
    }))
  }, [])

  const addUnreadMessage = useCallback((conversationId: string, message: ChatMessage<MessageContentType>) => {
    if (message.direction === MessageDirection.Outgoing && message.status !== MessageStatus.Seen) {
      setUnreadMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), message]
      }))
    }
  }, [])

  const getUnreadMessages = useCallback((conversationId: string) => {
    return unreadMessages[conversationId] ?? []
  }, [unreadMessages])

  const clearUnreadMessages = useCallback((conversationId: string) => {
    setUnreadMessages((prev) => ({
      ...prev,
      [conversationId]: []
    }))
  }, [])

  const readUnreadMessages = useCallback((conversationId: string) => {
    const messages = getUnreadMessages(conversationId)
    if (messages.length === 0) return;
    messages.forEach((message) => {
      message.status = MessageStatus.Seen
    });
    clearUnreadMessages(conversationId)
  }, [clearUnreadMessages, getUnreadMessages])

  const values = useMemo(() => ({
    conversationsStatus,
    setConversationsStatus,
    getConversationMessagesStatus,
    setConversationMessagesStatus,
    addUnreadMessage,
    getUnreadMessages,
    readUnreadMessages,
  }), [addUnreadMessage, conversationsStatus, getConversationMessagesStatus, getUnreadMessages, readUnreadMessages, setConversationMessagesStatus])

  return (
    <SecondaryChatManager {...values}>
      {children}
    </SecondaryChatManager>
  )
}

export { useSecondaryChat, SecondaryChatProvider }
