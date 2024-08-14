import { ConnectionState, ConnectionStateChangedEvent } from "@chatscope/use-chat";
import { useChat } from "./use-chat";
import { useEffect, useRef } from "react";

/**
 * A hook that continuously sustains a WebSocket connection by ping/pong messages
 */
export const usePersistChatService = () => {
  const { service } = useChat()
  const pingInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const onConnectionStateChanged = (event: ConnectionStateChangedEvent) => {
      if (event.status === ConnectionState.Connected) {
        pingInterval.current = setInterval(() => {
          console.log("Naerochat", "Pinging server")
          service.ping()
        }, 7000)
      } else if (event.status === ConnectionState.Disconnected && service?.ws?.readyState === service?.ws?.CLOSED) {
        clearInterval(pingInterval.current)
        service.ws?.reconnect()
      }
    }

    service.on("connectionStateChanged", onConnectionStateChanged)

    return () => {
      service.off("connectionStateChanged", onConnectionStateChanged)
    }
  }, [service])
}