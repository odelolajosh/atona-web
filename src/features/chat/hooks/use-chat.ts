import { useChat as _useChat, ChatMessage, Conversation, ConversationId, MessageContentType, SendMessageParams } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";
import { ChatService } from "../lib/chat-service";
import { useSecondaryChat } from "../lib/secondary-chat";
import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/use-storage";

type UseChat = ReturnType<typeof _useChat<ConversationData, UserData>> & {
  service: ChatService
}

export const useChat = (consumerName: string) => {
  const {
    addConversation,
    setActiveConversation: _setActiveConversation,
    addMessage: _addMessage,
    sendMessage: _sendMessage,
    updateState,
    ...chat
  } = _useChat<ConversationData, UserData>() as UseChat
  const {
    getUnreadMessages,
    addUnreadMessage,
    readUnreadMessages: _readUnreadMessages,
    ...secondaryChat
  } = useSecondaryChat(consumerName)
  const [temporaryConversation, setTemporaryConversations] = useLocalStorage<Conversation<ConversationData>[]>("temporary_conversations", []);

  const addTemporaryConversation = useCallback((conversation: Conversation<ConversationData>) => {
    addConversation(conversation)
    setTemporaryConversations((prev) => [...prev, conversation])
  }, [addConversation, setTemporaryConversations])

  const removeTemporaryConversation = useCallback((conversationId: string) => {
    // removeConversation(conversationId)
    setTemporaryConversations((prev) => prev.filter((c) => c.id !== conversationId))
  }, [setTemporaryConversations])

  const sendMessage = useCallback(async (params: SendMessageParams) => {
    _sendMessage(params)
    addUnreadMessage(params.conversationId, params.message)
  }, [_sendMessage, addUnreadMessage])

  const addMessage = useCallback((message: ChatMessage<MessageContentType>, conversationId: ConversationId, generateId: boolean) => {
    _addMessage(message, conversationId, generateId)
    addUnreadMessage(conversationId, message)
  }, [_addMessage, addUnreadMessage])

  const setActiveConversation = useCallback((conversationId: ConversationId) => {
    _setActiveConversation(conversationId)
    // Check if the conversation has unread messages
    const unreadMessages = getUnreadMessages(conversationId)
    if (unreadMessages.length > 0) {
      console.log("unreadMessages", unreadMessages)
      chat.service.sendReadReceipt({
        conversationId,
        messageIds: unreadMessages.map((m) => m.id)
      })
    }
  }, [_setActiveConversation, chat.service, getUnreadMessages])

  const readUnreadMessages = useCallback((conversationId: ConversationId) => {
    _readUnreadMessages(conversationId)
    updateState()
  }, [_readUnreadMessages, updateState])

  return {
    ...chat,
    ...secondaryChat,
    updateState,
    addConversation,
    addMessage,
    sendMessage,
    setActiveConversation,
    temporaryConversation,
    addTemporaryConversation,
    removeTemporaryConversation,
    readUnreadMessages
  }
};