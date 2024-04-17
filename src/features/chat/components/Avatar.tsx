import { useMemo } from "react"
import { cn } from "@/lib/utils"

type AvatarProps = {
  name: string
  src?: string
} & React.HTMLAttributes<HTMLDivElement>

export const Avatar = ({ name, src, ...props }: AvatarProps) => {

  const initials = useMemo(() => {
    return name.substring(0, 2).toUpperCase()
  }, [name])

  return (
    <div {...props} className={cn("flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center", props.className)}>
      {src ? <img src={src} alt={name} className="w-full h-full rounded-full" /> : initials}
    </div>
  )
}