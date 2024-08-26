import { useEffect } from "react";
import { useChat } from "./use-chat"
import { ChatEventHandler, ChatEventType } from "../lib/events";
import { ChatEvent } from "@chatscope/use-chat";
import { __DEV__ } from "../lib/const";

const useChatEventListener = <T extends ChatEventType, E extends ChatEvent<T>>(event: T, callback: ChatEventHandler<T, E>) => {
  const { service } = useChat();

  useEffect(() => {
    const handler = (event: E) => {
      if (__DEV__) {
        console.log('use-chat-event-listener.tsx:', event, event)
      }
      callback(event)
    }

    service.on(event, handler)

    return () => {
      service.off(event, handler)
    }
  }, [callback, event, service])
}

export { useChatEventListener }