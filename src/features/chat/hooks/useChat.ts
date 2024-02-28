import { useChat } from "@chatscope/use-chat";
import { ConversationData, UserData } from "../types";

export const useTypedChat = () => useChat<ConversationData, UserData>();