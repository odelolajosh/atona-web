type MessageHtmlContentProps = {
  html: string
}

export const MessageHtmlContent: React.FC<MessageHtmlContentProps> = ({ html }) => {
  return (
    <div className="naero-message html" dangerouslySetInnerHTML={{ __html: html }}></div>
  )
}