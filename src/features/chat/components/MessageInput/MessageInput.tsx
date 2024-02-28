import React, { useRef } from "react"
import { ContentEditable } from "./ContentEditable"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"
import { useControllableState } from "@/lib/hooks/state"

type MessageInputProps = {
  value?: string
  autoFocus?: any
  placeholder?: any
  className?: string
  onChange?: (innerHTML: string, textContent?: string | null, innerText?: string) => void
  onSend?: (innerHTML: string, textContent?: string | null, innerText?: string, childNodes?: NodeListOf<ChildNode>) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ value: _value, placeholder, className, onChange, onSend }) => {
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

  const handleChange = (innerHTML: string, textContent?: string | null, innerText?: string) => {
    setValue(innerHTML)
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
      onSend?.(trimmedValue, textContent as string, innerText as string, childNodes as any)
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
    <div className={cn("relative bg-primary-900 rounded-2xl w-full max-w-2xl", className)}>
      {/* Content Editable */}
      <div className="w-full h-full">
        <ContentEditable ref={editableRef} className="w-full h-full min-h-14 max-h-48 overflow-y-auto p-4 pr-32 outline-none bg-transparent text-white content-editable-ph" placeholder={placeholder} value={value} onChange={handleChange} onKeyPress={handleKeyPress} />
      </div>
      {/* Send Button */}
      <div className="absolute right-0 bottom-0 p-1 flex justify-center align-center gap-2">
        <Button className="p-3 pl-4 h-auto hover:bg-success rounded-2xl" onClick={handleSend}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </Button>
      </div>
    </div>
  )
}