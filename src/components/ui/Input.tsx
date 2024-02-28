import { cn } from "@/lib/utils";
import { PropsWithChildren, forwardRef, useId } from "react";

type WrapperProps = {
  label?: string;
  error?: string;
}

const Wrapper = (props: PropsWithChildren<WrapperProps &  { id: string }>) => {
  return (
    <div className="space-y-1">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.children}
      {props.error && <span>{props.error}</span>}
    </div>
  )
}

const Noop = (props: PropsWithChildren<WrapperProps>) => <>{props.children}</>

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const id = props.id || useId();
  const Container = props.label || props.error ? Noop : Wrapper;

  return (
    <Container id={id} label={props.label} error={props.error}>
      <input {...props} ref={ref} id={id} className={cn("w-full appearance-none items-center justify-center rounded-lg px-2.5 py-2.5 text-base shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-b", props.className)} />
    </Container>
  )
})