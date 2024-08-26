import { AttachmentContent, AttachmentListContent, Conversation, HtmlContent, MessageContent, Participant, Presence, User, UserStatus } from "@chatscope/use-chat";
import { ConversationData } from "../types";
import { sessionStorage } from "@/lib/storage";
import { UploadResponse } from "../components";


export const createTemporaryConversation = (currentUserId: string, user: { id: string, name: string, avatar?: string }) => {
  const participants = [currentUserId, user.id].map((id) => new Participant({ id }));
  const temporaryConversation = new Conversation<ConversationData>({
    id: `t_${user.id}`, // Temporary conversation id
    participants,
    data: {
      type: "dm",
      name: "",
      temporary: true
    }
  });

  const temporaryUser = new User({
    id: user.id,
    presence: new Presence({
      status: UserStatus.Available
    }),
    username: user.name,
    avatar: user.avatar,
    data: {}
  });

  sessionStorage.set(`temporary_conversation_${user.id}`, temporaryConversation.id);
  return [temporaryConversation, temporaryUser] as const;
}

export const createMessageContent = (text: string, attachments?: UploadResponse[]): MessageContent<HtmlContent | AttachmentListContent> => {
  if (attachments?.length) {
    return {
      content: attachments.map((item) => {
        return {
          url: item.url,
        } as AttachmentContent;
      }),
      description: text
    } as MessageContent<AttachmentListContent>;
  }

  return {
    content: text
  } as MessageContent<HtmlContent>;
}