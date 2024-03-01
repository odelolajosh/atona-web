import { useEffect, useRef } from "react";
import { ConversationHeader, MessageInput, MessageList, MessageListRef, Messages } from "."
import { useTypedChat } from "../hooks/useChat"
import { ChatMessage, HtmlContent, MessageContent, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";

export const ChatRoom = () => {
  const { activeConversation, sendMessage, currentUser, currentMessage, setCurrentMessage, currentMessages } = useTypedChat();
  const messageListRef = useRef<MessageListRef>(null);

  useEffect(() => {
    messageListRef.current?.mount()
  }, [activeConversation])

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

    console.log("Handle Send", message)

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
        <Messages messages={currentMessages} />
      </MessageList>
      <MessageInput onSend={handleSend} value={currentMessage} onChange={handleChange} />
    </div>
  )
}