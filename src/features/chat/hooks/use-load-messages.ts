import { ChatMessage, MessageContentType, MessageDirection, MessageStatus, useChat } from "@chatscope/use-chat"
import { useCallback, useEffect, useMemo } from "react"
import { __DEV__ } from "../lib/const"
import chatAPI from "../lib/api"
import { useChatState } from "../lib/provider";

const useLoadMessages = (consumerName: string) => {
  const { addMessage, activeConversation, removeMessagesFromConversation, currentUser } = useChat()
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
          direction: message.from.uuid === currentUser!.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
          senderId: message.from.uuid,
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
    if (status === 'loading' || status === 'success') return;

    loadInitialMessages()
  }, [activeConversation, loadInitialMessages, status])

  return { status }
}

export { useLoadMessages }