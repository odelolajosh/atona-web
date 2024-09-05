import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
  Ref,
  useState,
} from "react";
import { prefix } from "../../lib/const";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";

type MessageListProps = {
  children: React.ReactNode;
  contentClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

type MessageListRef = {
  scrollToBottom: (scrollBehavior: ScrollBehavior) => void;
  resetScroll: () => void;
}

const MessageListInner = forwardRef<MessageListRef, MessageListProps>(({
  children,
  className,
  contentClassName,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevContentHeight = useRef<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = useCallback((scrollBehavior: ScrollBehavior = "smooth") => {
    if (!containerRef.current || !contentRef.current) return;

    const outerHeight = containerRef.current.clientHeight;
    const innerHeight = contentRef.current.clientHeight;

    containerRef.current.scrollTo({
      top: innerHeight - outerHeight,
      left: 0,
      behavior: scrollBehavior,
    });
  }, []);

  const resetScroll = useCallback(() => {
    prevContentHeight.current = null
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToBottom,
    resetScroll,
  }));

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // The scroll is sticked when the scroll position is equals to the offset
    // By offset we mean the difference between the content height and the container height
    // i.e container.scrollTop === prevContentHeight.current - container.clientHeight
    // For precision we use 1px difference

    // If sticked, scroll to the end
    if (!prevContentHeight.current || container.scrollTop + container.clientHeight >= prevContentHeight.current - 1) {
      scrollToBottom(prevContentHeight.current ? "smooth" : "auto");
    }

    prevContentHeight.current = content.clientHeight;
  }, [children, scrollToBottom]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    const handleScroll = () => {
      const isAtBottom = container.scrollTop + container.clientHeight >= content.clientHeight - 1;
      setIsAtBottom(isAtBottom);
    }

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div {...props} ref={containerRef} className={cn("relative overflow-y-auto", "naero-chat-container", className)}>
      <div ref={contentRef} {...{ [`data-${prefix}-message-list`]: "" }} className={cn("overscroll-none", contentClassName)}>
        {children}
      </div>
      {!isAtBottom && (
        <Button variant="secondary" className="fixed bottom-24 right-4" onClick={() => scrollToBottom("smooth")}>
          <DoubleArrowDownIcon />
        </Button>
      )}
    </div>
  );
});

const MessageList = forwardRef<MessageListRef, MessageListProps>((props, ref) => {
  return <MessageListInner ref={ref as Ref<MessageListRef>} {...props} />;
});


export { MessageList };
export type { MessageListRef };
