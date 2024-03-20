import React, { useRef } from "react"
import { ContentEditable } from "./ContentEditable"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"
import { useControllableState } from "@/lib/hooks/state"
import { PaperAirplaneIcon, PlusIcon } from "@heroicons/react/24/outline"
import { UploadButton, UploadPreview } from "../Uploader"

type MessageInputProps = {
  value?: string
  autoFocus?: boolean
  placeholder?: string
  className?: string
  conversationId: string
  onChange?: (innerHTML: string, textContent?: string | null, innerText?: string) => void
  onSend?: (innerHTML: string, textContent?: string | null, innerText?: string, childNodes?: NodeListOf<ChildNode>) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ value: _value, placeholder, className, conversationId, onChange, onSend }) => {
  const editableRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useControllableState({
    prop: _value,
    defaultProp: "",
    onChange
  })

  const getContent = () => {
    const contentEditable = editableRef.current
    return [
      contentEditable?.textContent,
      contentEditable?.innerText,
      contentEditable?.cloneNode(true).childNodes,
    ];
  }

  const handleChange = (innerHTML: string) => {
    setValue(innerHTML)
    const textContent = editableRef.current?.textContent
    const innerText = editableRef.current?.innerText
    onChange?.(innerHTML, textContent, innerText)
  }

  const handleSend = () => {
    if (value && value.length > 0) {
      // Clear input in uncontrolled mode
      if (value === undefined) {
        setValue("")
      }

      // trim value of html whitespace and newlines
      const trimmedValue = value.replace(/<br\s*\/?>/gi, "").trim()

      const [textContent, innerText, childNodes] = getContent()
      onSend?.(trimmedValue, textContent as string, innerText as string, childNodes as NodeListOf<ChildNode>)
    }
  }

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      evt.key === "Enter" &&
      evt.shiftKey === false
    ) {
      evt.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <div className={cn("relative bg-surface-input border border-stroke-input rounded-2xl w-full max-w-2xl", className)}>
        {/* Attachment Button */}
        <div className="absolute left-0 bottom-0 p-1 flex justify-center align-center gap-2">
          <UploadButton>
            <Button variant="ghost" className="p-3 h-auto hover:bg-secondary rounded-2xl">
              <PlusIcon width={24} />
            </Button>
          </UploadButton>
        </div>
        {/* Content Editable */}
        <div className="w-full h-full">
          <ContentEditable ref={editableRef} className="w-full h-full min-h-14 max-h-48 overflow-y-auto p-4 px-16 outline-none bg-transparent text-white content-editable-ph" placeholder={placeholder} value={value} onChange={handleChange} onKeyPress={handleKeyPress} />
        </div>
        {/* Send Button */}
        <div className="absolute right-0 bottom-0 p-1 flex justify-center align-center gap-2">
          <Button className="p-3 pl-4 h-auto hover:bg-success rounded-2xl" onClick={handleSend}>
            <PaperAirplaneIcon width={24} />
          </Button>
        </div>
      </div>
      <UploadPreview conversationId={conversationId} />
    </div>
  )
}