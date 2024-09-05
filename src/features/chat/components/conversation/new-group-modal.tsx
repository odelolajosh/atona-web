import { useState } from 'react'
import { useChat } from '../../hooks/use-chat';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogProps } from '@/components/ui/dialog';
import { useControllableState } from '@/lib/hooks/use-state';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

type NewGroupModalProps = DialogProps & { children?: React.ReactNode }

const formSchema = z.object({
  name: z.string().min(2, { message: "Group name is too short" }).max(50, { message: "Group name is too long" }),
})

export const NewGroupModal: React.FC<NewGroupModalProps> = (props) => {
  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    defaultProp: false,
    onChange: props.onOpenChange
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { users, currentUser, service } = useChat("NewGroupModal")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    if (selectedUsers.length === 0) return
    service.createConversation(selectedUsers, values.name)
    setSelectedUsers([])
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {props.children && <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>}
      <Dialog.Content className="sm:max-w-[425px] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>New group</Dialog.Title>
          <Dialog.Description>
            Select users to start a groups
          </Dialog.Description>
        </Dialog.Header>
        <div>
          {selectedUsers.length > 0 ? (
            <div className="flex flex-row gap-4 items-center">
              <div className="text-muted-foreground tracking-wider">
                {selectedUsers.length} selected
              </div>
              <button className="text-foreground" onClick={() => setSelectedUsers([])}>
                Clear
              </button>
            </div>
          ) : null}
        </div>
        <div className="max-h-[calc(100vh-200px)] overflow-auto">
          <div className="px-1 grow overflow-y-auto max-h-[50vh]">
            {users.map((u) => {
              if (u.id === currentUser?.id) return null

              const selected = selectedUsers.includes(u.id)
              const classes = cn(
                "flex flex-row gap-4 items-center",
                "h-12 px-4 py-6 my-1 rounded-xl",
                "transition-colors cursor-pointer",
                {
                  "hover:bg-muted": !selected,
                  "bg-secondary text-secondary-foreground": selected,
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
                  <div className={cn({ "font-medium": selected })}>
                    {u.username}
                  </div>
                </div>
              )
            })}
            {users.length === 0 && (
              <div>Nothing here</div>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Dialog.Footer className='flex-col sm:flex-col sm:space-x-0 gap-1.5'>
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Control>
                      <Input placeholder="Group name" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Button type='submit' disabled={selectedUsers.length === 0} className='w-full'>
                Create Group
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  )
}

export default NewGroupModal