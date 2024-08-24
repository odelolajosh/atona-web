import { useQuery } from "@tanstack/react-query"
import chatAPI from "../lib/api"
import { queryClient } from "@/lib/react-query";

export const useChatSearch = (q?: string) => {
  return useQuery({
    queryKey: ['chat-search', q],
    queryFn: () => {
      const cache = queryClient.getQueryData(['chat-search', q])
      if (cache) return cache as ReturnType<typeof chatAPI.getSearchResults>

      return chatAPI.getSearchResults(q!)
    },
    enabled: !!q
  })
}