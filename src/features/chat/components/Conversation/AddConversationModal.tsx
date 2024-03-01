import { useState } from 'react'
import { useTypedChat } from '../../hooks/useChat';
import { Modal, ModalProps } from '@/components/ui/Modal';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type AddConversationModalProps = ModalProps;

export const AddConversationModal: React.FC<AddConversationModalProps> = (props) => {
  const { users, currentUser, service } = useTypedChat();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleAction = async () => {
    if (selectedUsers.length === 0) return
    try {
      await service.createConversation(selectedUsers)
      handleClose()
    } catch (err) {
      console.error("Failed to create conversation", err)
    }
  }

  const handleSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleClose = () => [
    setSelectedUsers([]),
    props.onOpenChange?.(false)
  ]

  return (
    <Modal.Root {...props} onOpenChange={(open) => !open && handleClose()}>
      <Modal.Content title="Add Conversation">
        <div className="my-2">
          {selectedUsers.length > 0 ? (
            <div className="flex flex-row gap-4 items-center">
              <div className="text-muted-foreground tracking-wider">
                {selectedUsers.length} selected
              </div>
              <button className="text-foreground" onClick={() => setSelectedUsers([])}>
                Clear
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground">
              Select users to start a conversation
            </div>
          )}
        </div>
        <div className="mt-6 mb-2 px-1 grow overflow-y-auto">
          {users.map((u) => {
            if (u.id === currentUser?.id) return null

            const selected = selectedUsers.includes(u.id)
            const classes = cn(
              "flex flex-row gap-4 items-center",
              "h-12 px-4 py-6 my-1 rounded-xl",
              "transition-colors cursor-pointer",
              {
                "hover:bg-secondary": !selected,
                "bg-primary": selected,
                // "opacity-50": csn[u.id]
              }
            )
            return (
              <div key={u.id} className={classes} onClick={() => handleSelection(u.id)}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  {u.username}
                </div>
              </div>
            )
          })}
          {users.length === 0 && (
            <div>Nothing here</div>
          )}
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <Button disabled={selectedUsers.length === 0} className="h-auto flex-1 py-2 px-4 rounded-lg transition-colors" onClick={handleAction}>
            Start Conversation
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}

export default AddConversationModal