import { useMemo } from "react"
import { Avatar } from "@/components/ui/avatar"

type AvatarProps = {
  name?: string
  src?: string
} & React.HTMLAttributes<HTMLSpanElement>

export const ChatAvatar = ({ name, src, ...props }: AvatarProps) => {
  const initials = useMemo(() => {
    if (!name) return ""
    return name.substring(0, 2).toUpperCase()
  }, [name])

  return (
    <Avatar {...props}>
      <Avatar.Image src={src} />
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar>
  )
}