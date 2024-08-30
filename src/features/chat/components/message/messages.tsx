import { PropsWithChildren } from "react"
import { Message, MessageGroup as MsgGroup } from "./message"
import { MessageGroup } from "@chatscope/use-chat/dist/MessageGroup"


type MessagesProps = PropsWithChildren<{
  messages: MessageGroup[]
}>

export const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <>
      {messages.map((g, index) => {
        return (
          <MsgGroup key={index} direction={g.direction} senderId={g.senderId}>
            {g.messages.map((m, index) => {
              return (
                <Message key={index} model={{
                  senderId: m.senderId,
                  type: m.contentType,
                  payload: m.content,
                  direction: m.direction,
                  updatedAt: m.createdTime,
                  status: m.status
                }} position={index} />
              )
            })}
          </MsgGroup>
        )
      })}
    </>
  )
}