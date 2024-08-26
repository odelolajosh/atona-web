import { useControllableState } from "@/lib/hooks/use-state";
import { forwardRef, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';

type EditorProps = {
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  value?: string
  onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>
  onChange?: (innerHTML: string) => void
  className?: string
}


export const Editor = forwardRef<HTMLDivElement, EditorProps>(({ disabled = false, placeholder, value, onKeyPress, onChange, autoFocus, ...rest }, ref) => {
  const msgRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useControllableState({
    prop: value,
    defaultProp: "",
    onChange: onChange
  })

  useEffect(() => {
    console.log("ContentEditable")
  }, [])

  useEffect(() => {
    if (autoFocus) {
      msgRef.current?.focus()
    }
  }, [autoFocus])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => onKeyPress?.(e)

  const handleChange = (value: string) => {
    setHtml(value)
  }

  return (
    <ReactQuill theme="snow" modules={{ toolbar: false, disabled }} placeholder={placeholder} value={html} onChange={handleChange} onKeyDown={handleKeyPress} className="naero-editor" />
  )
})