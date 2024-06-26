import { cn } from "@/lib/utils";
import Svg, { SvgProps } from "./svg";

export const Spinner = (props: SvgProps) => (
  <Svg {...props} className={cn("animate-spin mx-auto text-text-black", props.className)} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </Svg>
)

export const Progress = (props: SvgProps & { progress: number }) => {
  const { progress, ...restProps } = props;

  return (
    <Svg {...restProps} className={cn("mx-auto text-text-black", props.className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <circle className="text-primary" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray={`${progress} 100`} transform="rotate(-90) translate(-24)" strokeLinecap="round"></circle>
    </Svg>
  );
}