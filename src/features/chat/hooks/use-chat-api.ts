import { useQuery } from "@tanstack/react-query"
import chatAPI from "../lib/api"
import { useToken } from "@/lib/auth"

export const useChatUser = () => {
  const { token } = useToken()
  return useQuery({
    queryKey: ['chat-user'],
    queryFn: async () => {
      chatAPI.authenticate(token)
      return chatAPI.getMe()
    }
  })
}