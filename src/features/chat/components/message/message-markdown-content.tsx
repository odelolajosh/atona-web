import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MessageHtmlContentProps = {
  markdown: string
}

export const MessageMarkdownContent: React.FC<MessageHtmlContentProps> = ({ markdown }) => {
  return (
    <Markdown className="naero-message" remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
  )
}