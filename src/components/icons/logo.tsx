import { cn } from "@/lib/utils"
import { NaeroIcon } from "./naero"

type LogoProps = {
  showText?: boolean
  iconWidth?: number
  iconHeight?: number
} & React.HTMLAttributes<HTMLSpanElement>

export const Logo = ({ showText, iconWidth = 64, iconHeight = 32, ...props }: LogoProps) => (
  <span {...props} className={cn('flex items-center content-center h-full gap-2', props.className)}>
    <NaeroIcon width={iconWidth} height={iconHeight} />
    {showText && (
      <span className="text-lg font-medium">Naerospace</span>
    )}
  </span>
)
