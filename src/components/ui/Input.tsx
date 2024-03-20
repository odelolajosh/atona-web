import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const _id = useId();
  const id = props.id || _id;
  
  return (
    <input ref={ref} id={id} {...props} className={cn("w-full flex items-center h-12 px-4 rounded-md border border-stroke-input bg-surface-input text-white rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary", props.className)} />
  )
})