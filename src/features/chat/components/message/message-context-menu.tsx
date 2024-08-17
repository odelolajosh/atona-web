import { ContextMenu } from "@/components/ui/context-menu"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

type MessageContextMenuProps = {
  onCopy?: () => void
  onEdit?: () => void
  onDelete?: () => void
} & ContextMenuPrimitive.ContextMenuProps

export const MessageContextMenu = ({ onCopy, onDelete, onEdit, children, ...props }: MessageContextMenuProps) => {
  return (
    <ContextMenu {...props}>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={onCopy}>Copy</ContextMenu.Item>
        <ContextMenu.Item onSelect={onEdit}>Edit</ContextMenu.Item>
        <ContextMenu.Item onSelect={onDelete}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  )
}
