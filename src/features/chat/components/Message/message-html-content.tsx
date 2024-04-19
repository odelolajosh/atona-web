type MessageHtmlContentProps = {
  html: string
}

export const MessageHtmlContent: React.FC<MessageHtmlContentProps> = ({ html }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
  )
}