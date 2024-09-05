import { Spinner } from "@/components/icons/spinner"
import { Dialog, DialogProps } from "@/components/ui/dialog"
import { useControllableState } from "@/lib/hooks/use-state"
import { useChatEventListener } from "../../hooks/use-chat-event-listener"
import { ConversationJoinedEvent } from "../../lib/events"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"

type JoinConversationModalProps = DialogProps & {
  children?: React.ReactNode
  to: string
}

export const JoinConversationModal: React.FC<JoinConversationModalProps> = (props) => {
  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    defaultProp: false,
    onChange: props.onOpenChange
  })
  const navigate = useNavigate()

  const onConversationJoined = useCallback((event: ConversationJoinedEvent) => {
    if (!event.conversation && !props.to) return;

    // check if conversation has a participant that is same as `to` prop and is not a group
    if (event.conversation.data?.type == 'dm' && event.conversation.participants.some(p => p.id === props.to)) {
      // navigate to conversation
      navigate(`/chat/${event.conversation.id}`)
      onOpenChange(false)
    }
  }, [navigate, onOpenChange, props.to])

  useChatEventListener("JoinConversationModal", "conversationJoined", onConversationJoined)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {props.children && <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>}
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Creating a conversation</Dialog.Title>
          <Dialog.Description>
            Shouldn&apos;t take long
          </Dialog.Description>
        </Dialog.Header>
        <div className="h-64 flex flex-col gap-4 items-center justify-center">
          <Spinner className="w-6 h-6" />
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}