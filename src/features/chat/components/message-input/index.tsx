import React, { useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DocumentIcon, PaperAirplaneIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { UploadButton } from "../uploader/uploader"
import { Progress } from "@/components/icons/spinner"
import { useUploaderPreview, useUploaderPreviewItem } from ".."
import { FILE_STATES } from "@rpldy/shared"
import { Button } from "@/components/ui/button"
import { MessageTextarea } from "./message-textarea"

type MessageInputProps = {
  value?: string
  autoFocus?: boolean
  placeholder?: string
  className?: string
  conversationId: string
  onChange?: (text: string) => void
  onSend?: (text: string) => void
}


export const MessageInput: React.FC<MessageInputProps> = ({ value, placeholder, className, conversationId, onChange, onSend }) => {
  const { isUploading } = useUploaderPreview(conversationId);

  const handleSend = useCallback(() => {
    if (isUploading || !value) return

    const content = value.replace(/<br\s*\/?>/gi, "").trim()

    if (content) {
      onSend?.(content)
    }
  }, [isUploading, onSend, value])

  const handleKeyDown = useCallback((ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault()
      handleSend()
    }
  }, [handleSend])


  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl p-2">
      <div className={cn("relative bg-input border border-border rounded-2xl w-full max-w-2xl", className)}>
        {/* Attachment Button */}
        <div className="absolute left-0 bottom-0 p-1 flex justify-center align-center gap-2">
          <UploadButton>
            <Button variant="ghost" className="p-3 h-auto hover:bg-secondary rounded-2xl">
              <PlusIcon width={24} />
            </Button>
          </UploadButton>
        </div>
        {/* Content Editable */}
        <MessageTextarea
          value={value}
          onChange={(ev) => onChange?.(ev.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-14 max-h-48 p-4 pl-14 pr-16 outline-none bg-transparent text-white"
        />
        {/* Send Button */}
        <div className="absolute right-0 bottom-0 p-1 flex justify-center align-center gap-2">
          <Button className="p-3 pl-4 h-auto hover:bg-success rounded-2xl" onClick={handleSend}>
            <PaperAirplaneIcon width={24} />
          </Button>
        </div>
      </div>
      <Preview conversationId={conversationId} />
    </div>
  )
}

const PreviewItem = ({ id, conversationId }: { id: string, conversationId: string }) => {
  const { progress, remove, item } = useUploaderPreviewItem(conversationId, id);
  const [showSpinner, setShowSpinner] = React.useState(true);

  useEffect(() => {
    if (item?.state === FILE_STATES.FINISHED) {
      setTimeout(() => {
        setShowSpinner(false)
      }, 100)
    }
  }, [item?.state])

  if (!item) return null
  return (
    <div key={item.id} className="relative group flex items-center gap-3 py-2 px-6 bg-input border border-border rounded-2xl">
      <span className="relative">
        <DocumentIcon width={24} />
        {showSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-input bg-opacity-90">
            <Progress progress={progress} size={16} />
          </div>
        )}
      </span>
      <div className="flex flex-col">
        <div className="text-sm max-w-[200px] truncate">
          {item.file.name}</div>
        <div className="text-xs text-muted">{item.file.type}</div>
      </div>
      <span className="absolute h-4 w-4 -right-1 -top-1 hidden group-hover:grid bg-error text-white rounded-full cursor-pointer place-items-center" onClick={remove}>
        <XMarkIcon width={14} />
      </span>
    </div>
  )
};

const Preview = ({ conversationId }: { conversationId: string }) => {
  const { items } = useUploaderPreview(conversationId);

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <PreviewItem key={item.id} id={item.id} conversationId={conversationId} />)}
    </div>
  )
};