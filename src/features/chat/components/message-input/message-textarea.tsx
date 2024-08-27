import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

type MessageTextareaProps = React.ComponentProps<typeof TextareaAutosize>;

const MessageTextarea = (props: MessageTextareaProps) => {
  return (
    <TextareaAutosize {...props} autoFocus minRows={1} className={cn("flex min-h-14 w-full rounded-md border-none  px-3 py-2 placeholder:text-muted-foreground outline-none  disabled:cursor-not-allowed disabled:opacity-50", props.className)} />
  )
}

export { MessageTextarea }
