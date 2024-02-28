import { cn } from "@/lib/utils";
import { useState } from "react";

type AvatarProps = {
  url?: string
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ url, className }) => {
  const [hidden, setHidden] = useState(!url);

  const handleError = () => {
    setHidden(true)
  }

  return (
    <div className={cn(className, "bg-neutral-600 w-8 h-8 rounded-full")}>
      <img src={url} alt="avatar" className={cn("w-8 h-8 rounded-full", { "hidden" : hidden })} onError={handleError} />
    </div>
  )
}