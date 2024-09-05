import { useEffect } from "react";
import { useChat } from "../hooks/use-chat";

export const Lobby = () => {
  const { setActiveConversation } = useChat("Lobby")

  useEffect(() => {
    setActiveConversation(null as unknown as string)
  }, [setActiveConversation])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted">
      <div className="text-gray-400">No chat selected</div>
    </div>
  )
}