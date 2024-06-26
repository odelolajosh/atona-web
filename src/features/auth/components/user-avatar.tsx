import { useMemo } from "react"
import { Avatar } from "@/components/ui/avatar"
import { useUser } from "@/lib/auth"

type AvatarProps = {
  name?: string
  src?: string
} & React.HTMLAttributes<HTMLSpanElement>

export const UserAvatar = ({ src, ...props }: AvatarProps) => {
  const { data: user } = useUser()
  const initials = useMemo(() => {
    if (!user) return ""
    if (user.username) return user.username.substring(0, 2).toUpperCase()
    return user.email.substring(0, 2).toUpperCase()
  }, [user])

  return (
    <Avatar {...props}>
      <Avatar.Image src={src} />
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar>
  )
}