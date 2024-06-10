import { useEffect, useRef } from "react";
import { ConversationHeader, Lobby, MessageInput, MessageList, MessageListRef, Messages, useUploaderStore } from "."
import { useChat } from "../hooks/use-chat"
import { ChatMessage, GalleryContent, GalleryItem, HtmlContent, MessageContent, MessageContentType, MessageDirection, MessageStatus } from "@chatscope/use-chat";
import { Spinner } from "@/components/icons/spinner";
import { Outlet, useParams } from "react-router-dom";
import { useLoadMessages } from "../hooks/use-load-messages";
import { Button } from "@/components/ui/button";

export const Room = () => {
  const { conversationId } = useParams() as { conversationId: string };
  const { activeConversation, setActiveConversation, sendMessage, currentUser, currentMessage, setCurrentMessage, currentMessages } = useChat();
  const { clearConversationUploads, getUploadedItems } = useUploaderStore("Room");
  const messageListRef = useRef<MessageListRef>(null);

  const loadMessages = useLoadMessages("Room");

  useEffect(() => {
    if (!conversationId) return;
    setActiveConversation(conversationId);
  }, [conversationId, setActiveConversation])

  const handleChange = (value: string) => {
    setCurrentMessage(value);
    // Send typing indicator
  }

  const handleAttachment = () => {
    if (!activeConversation) return;
    const items = getUploadedItems(activeConversation.id);
    if (!items?.length) return;

    const message = new ChatMessage({
      id: "", // Id will be generated by storage generator, so here you can pass an empty string
      content: {
        content: items.map((item) => {
          return {
            description: "",
            src: item.url,
          } as GalleryItem;
        })
      } as MessageContent<GalleryContent>,
      contentType: MessageContentType.Gallery,
      senderId: currentUser!.id,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    sendMessage({
      message,
      conversationId: activeConversation.id,
      senderId: currentUser!.id,
    });

    clearConversationUploads(activeConversation.id);
  }

  const handleSend = (text: string) => {
    if (!activeConversation) return;
    handleAttachment();
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

    sendMessage({
      message,
      conversationId: activeConversation.id,
      senderId: currentUser!.id,
    });

  };

  if (!activeConversation) return (
    <Lobby />
  )

  return (
    <div className="h-full flex flex-col items-center sm:pb-4 border-l border-border">
      <ConversationHeader />
      <hr className="w-full border-t border-border" />
      {loadMessages.status === 'success' ? (
        <MessageList className="w-full flex-1 py-4 message--font" ref={messageListRef}>
          <Messages messages={currentMessages} />
        </MessageList>
      ) : loadMessages.status === 'error' ? (
        <div className="w-full flex-1 py-4 flex flex-col justify-center items-center gap-2">
          <h3>We could not load messages</h3>
          <Button onClick={() => loadMessages.retry()}>Retry</Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center h-full">
          <Spinner />
        </div>
      )}
      <MessageInput conversationId={conversationId} onSend={handleSend} value={currentMessage} onChange={handleChange} />
      <Outlet />
    </div>
  )
}