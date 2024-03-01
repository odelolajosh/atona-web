import { useEffect, useRef } from "react";
import { ConversationHeader, MessageInput, MessageList, MessageListRef, Messages } from "."
import { useTypedChat } from "../hooks/useChat"
import { ChatMessage, HtmlContent, MessageContent, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";
import chatAPI from "../lib/api";
import { Spinner } from "@/components/icons/Spinner";

export const ChatRoom = () => {
  const { activeConversation, sendMessage, currentUser, currentMessage, setCurrentMessage, currentMessages, addMessage } = useTypedChat();
  const messageListRef = useRef<MessageListRef>(null);

  useEffect(() => {
    if (!activeConversation) return;

    messageListRef.current?.mount()

    // TODO: conversation data should even be compulsory
    if (activeConversation.data && activeConversation.data.initialMessageStatus !== 'success') {
      activeConversation.data.initialMessageStatus = 'loading';
      loadInitialMessages().then(() => {
        activeConversation.data!.initialMessageStatus = 'success';
      })
    }
  }, [activeConversation])

  const loadInitialMessages = async () => {
    if (!activeConversation) return;
    const messages = await chatAPI.getMessages(activeConversation?.id);

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
  }

  const handleChange = (value: string) => {
    setCurrentMessage(value);
    // Send typing indicator
  }

  const handleSend = (text: string) => {
    const message = new ChatMessage({
      id: "", // Id will be generated by storage generator, so here you can pass an empty string
      content: {
        content: text
      } as MessageContent<HtmlContent>,
      contentType: MessageContentType.TextHtml,
      senderId: currentUser!.id,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    if (activeConversation) {
      sendMessage({
        message,
        conversationId: activeConversation.id,
        senderId: currentUser!.id,
      });
    }

  };

  if (!activeConversation) return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-secondary">
      <div className="text-gray-400">No chat selected</div>
    </div>
  )

  return (
    <div className="flex-1 h-full flex flex-col items-center pb-4 border-l border-stroke-separator/50">
      <ConversationHeader />
      <hr className="w-full border-t border-stroke-separator/50" />
      <MessageList className="w-full flex-1 py-4 message--font" ref={messageListRef}>
        {activeConversation.data?.initialMessageStatus === 'success' ? (
          <Messages messages={currentMessages} />
        ) : activeConversation.data?.initialMessageStatus === 'error' ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full">
            We could not load messages
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full">
            <Spinner />
          </div>
        )}
      </MessageList>
      <MessageInput onSend={handleSend} value={currentMessage} onChange={handleChange} />
    </div>
  )
}