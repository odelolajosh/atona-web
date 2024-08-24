import { useEffect, useState } from "react";
import { useChat } from "./use-chat"
import { ConnectionState, ConnectionStateChangedEvent, UserStatus } from "@chatscope/use-chat";

const usePresence = () => {
  const { service, currentUser } = useChat();
  const [presence, setPresence] = useState<UserStatus>(currentUser?.presence.status || UserStatus.Unavailable);

  useEffect(() => {
    const onConnectionStateChanged = (event: ConnectionStateChangedEvent) => {
      if (event.status === ConnectionState.Connected) {
        setPresence(UserStatus.Available)
      } else {
        setPresence(UserStatus.Unavailable)
      }
    }

    service.on("connectionStateChanged", onConnectionStateChanged)

    return () => {
      service.off("connectionStateChanged", onConnectionStateChanged)
    }
  }, [service])

  return presence;
}

export { usePresence }