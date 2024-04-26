import { GalleryItem } from "@chatscope/use-chat"

type MessageHtmlContentProps = {
  items: GalleryItem[]
}

export const MessageGalleryContent: React.FC<MessageHtmlContentProps> = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <img key={index} src={item.src} alt={item.description} />
      ))}
    </div>
  )
}