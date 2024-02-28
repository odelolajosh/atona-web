import { forwardRef, useEffect, useRef } from "react";

function mergeRefs<T = any>(
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
  onChange?: (innerHTML: string, textContent?: string | null, innerText?: string) => void
  className?: string
}

const replaceCaret = (el: HTMLElement, activateAfterChange: boolean) => {
  const isTargetFocused = document.activeElement === el;

  // Place the caret at the end of the element
  const target = document.createTextNode("");

  // Put empty text node at the end of input
  el.appendChild(target);

  // do not move caret if element was not focused
  if (
    target !== null &&
    target.nodeValue !== null &&
    (isTargetFocused || activateAfterChange)
  ) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(({ disabled = false, placeholder, value, onKeyPress, onChange, autoFocus, ...rest }, ref) => {
  const msgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus) {
      msgRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (!msgRef.current) return
    if (value !== msgRef.current?.innerHTML) {
      msgRef.current.innerHTML = typeof value === "string" ? value : "";
    }
    replaceCaret(msgRef.current, true);
  }, [value])

  const focus = () => {
    msgRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => onKeyPress?.(e)

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const { innerHTML, textContent, innerText } = target
    onChange?.(innerHTML, textContent, innerText)
  }

  const innerHTML = () => {
    return {
      __html: typeof value !== "undefined" ? value : "",
    };
  };

  return (
    <div
      ref={mergeRefs(ref, msgRef)}
      {...rest}
      contentEditable={disabled === false}
      aria-disabled={disabled}
      data-placeholder={placeholder || ""}
      onInput={handleInput}
      onKeyPress={handleKeyPress}
      dangerouslySetInnerHTML={innerHTML()}></div>
  )
})