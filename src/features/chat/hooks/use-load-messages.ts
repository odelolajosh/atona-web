import { ChatMessage, ConnectionState, ConnectionStateChangedEvent, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { __DEV__ } from "../lib/const"
import chatAPI from "../lib/api"
import { useChatState } from "../lib/provider";
import { useChat } from "./use-chat";

const MAX_TRY_COUNT = 1

const useLoadMessages = (consumerName: string) => {
  const tryCount = useRef(0)
  const { addMessage, activeConversation, removeMessagesFromConversation, currentUser, service } = useChat()
  const { getConversationMessagesStatus, setConversationMessagesStatus } = useChatState(consumerName)

  const status = useMemo(() => {
    if (!activeConversation) return 'idle';
    return getConversationMessagesStatus(activeConversation?.id) || 'idle';
  }, [activeConversation, getConversationMessagesStatus])

  const loadInitialMessages = useCallback(async () => {
    if (!activeConversation) return;

    if (__DEV__) {
      setConversationMessagesStatus(activeConversation.id, 'success');
      return;
    }

    setConversationMessagesStatus(activeConversation.id, 'loading');

    try {
      const messages = await chatAPI.getMessages(activeConversation?.id);

      removeMessagesFromConversation(activeConversation.id);

      messages.forEach((message) => {
        const chatMessage = new ChatMessage({
          id: message.uuid,
          direction: message.from.userId === currentUser!.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
          senderId: message.from.userId,
          content: {
            content: message.body,
          },
          contentType: MessageContentType.TextHtml,
          status: MessageStatus.Sent,
          createdTime: new Date(message.created_at),
        });
        addMessage(chatMessage, activeConversation.id, false);
      })
      setConversationMessagesStatus(activeConversation.id, 'success');
    } catch (error) {
      console.error("Failed to load messages", error);
      setConversationMessagesStatus(activeConversation.id, 'error');
    }
  }, [activeConversation, addMessage, currentUser, removeMessagesFromConversation, setConversationMessagesStatus])

  useEffect(() => {
    if (activeConversation?.id) {
      tryCount.current = 0
    }
  }, [activeConversation])

  const tryLoadingMessages = useCallback(async (retry = false) => {
    if (status === 'loading') return
    if (!retry && status === 'success') return

    if (retry) tryCount.current = 0
    if (status === 'error' && tryCount.current >= MAX_TRY_COUNT) return;

    await loadInitialMessages()
    tryCount.current++;
  }, [loadInitialMessages, status])

  useEffect(() => {
    tryLoadingMessages()
  }, [tryLoadingMessages])

  const retryLoading = useCallback(() => {
    tryLoadingMessages(true)
  }, [tryLoadingMessages])

  useEffect(() => {
    const onConnectionStateChanged = (event: ConnectionStateChangedEvent) => {
      if (event.status === ConnectionState.Connected) {
        retryLoading()
      }
    }

    service.on("connectionStateChanged", onConnectionStateChanged)

    return () => {
      service.off("connectionStateChanged", onConnectionStateChanged)
    }
  }, [retryLoading, service])

  return { status, retry: retryLoading }
}

export { useLoadMessages }