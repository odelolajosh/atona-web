import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Message, MessageGroup as MsgGroup } from "./message"
import { MessageGroup } from "@chatscope/use-chat/dist/MessageGroup"

const isNewDay = (g1: MessageGroup, g2: MessageGroup) => {
  return g1.messages[0].createdTime.toDateString() !== g2.messages[0].createdTime.toDateString()
}

const isToday = (compareDate: Date) => {
  const today = new Date();
  return today.toDateString() === compareDate.toDateString();
}

type MessagesProps = PropsWithChildren<{
  messages: MessageGroup[]
}>

export const Messages: React.FC<MessagesProps> = ({ messages }) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  return (
    <>
      {currentDate && !isToday(currentDate) ? (
        <div className="sticky top-0 bg-muted-foreground/50 z-10 text-center opacity-0">
          {currentDate.toDateString()}
        </div>
      ) : null}
      {messages.map((g, index) => {
        return (
          <div className="relative" key={index}>
            {index == 0 ? (
              <div className="text-center my-10">
                {/* This is the start of your conversation with {g.senderId} */}
              </div>
            ) : isNewDay(messages[index - 1], g) ? (
              <MessageDateSeparator date={g.messages[0].createdTime} onDateChange={setCurrentDate} />
            ) : null}
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
          </div>
        )
      })}
    </>
  )
}

interface MessageDateWrapperProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const MessageDateSeparator = ({ date, onDateChange }: MessageDateWrapperProps) => {
  const dateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dateRef.current) return;

    const dateSeparator = dateRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.boundingClientRect.top < entry.rootBounds!.top) {
            // Only trigger onDateChange when the date separator crosses the top
            onDateChange(date);
          }
        });
      },
      {
        root: document.querySelector(".naero-chat-container"),
        threshold: 0
      }
    );

    observer.observe(dateSeparator);

    return () => {
      observer.unobserve(dateSeparator);
    };
  }, [date, onDateChange]);

  return (
    <div ref={dateRef} data-date={date.toDateString()} className="message-date-wrapper">
      <div className="text-center my-4 text-sm">{date.toDateString()}</div>
    </div>
  );
}