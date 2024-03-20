import { useControllableState } from "@/lib/hooks/state";
import { forwardRef, useEffect, useRef } from "react";
import ReactContentEditable, { ContentEditableEvent } from "react-contenteditable";

function mergeRefs<T = object>(
  ...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

type ContentEditableProps = {
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  value?: string
  onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>
  onChange?: (innerHTML: string) => void
  className?: string
}


export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(({ disabled = false, placeholder, value, onKeyPress, onChange, autoFocus, ...rest }, ref) => {
  const msgRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useControllableState({
    prop: value,
    defaultProp: "",
    onChange: onChange
  })

  useEffect(() => {
    if (autoFocus) {
      msgRef.current?.focus()
    }
  }, [autoFocus])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => onKeyPress?.(e)

  const handleChange = (e: ContentEditableEvent) => {
    const value = e.target.value
    setHtml(value)
  }

  return (
    <ReactContentEditable
      innerRef={mergeRefs(ref, msgRef)}
      {...rest}
      autoCorrect="off"
      contentEditable={disabled === false}
      aria-disabled={disabled}
      data-placeholder={placeholder || ""}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      html={html!}
      tagName="div"
    />
  )
})