import Uploady, { useBatchAddListener } from "@rpldy/uploady";
import { asUploadButton } from "@rpldy/upload-button";
import type { Batch, BatchItem } from "@rpldy/shared";
import { FC, PropsWithChildren } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useTypedChat } from "../hooks/useChat";
import { useUploaderStore } from "../lib/uploader";

export const UploadProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Uploady destination={{ url: "https://my-server.com/upload" }}>
      <>
        {children}
        <Uploader />
      </>
    </Uploady>
  )
}

export const Uploader = () => {
  const { activeConversation } = useTypedChat();
  const uploaderStore = useUploaderStore();

  useBatchAddListener((batch: Batch) => {
    if (!activeConversation?.id) {
      return false;
    }
    console.log({ batch })
    uploaderStore.add(activeConversation.id, batch);
  });

  return null;
}

export const UploadButton = asUploadButton((props: PropsWithChildren) => (
  <Slot {...props} />
));

export type BatchAdditionalInfo = {
  conversationId: string;
}

const withConversationUploads = <T extends object>(WrappedComponent: React.ComponentType<T & { items: BatchItem[] }>) => {
  return (props: T & { conversationId: string }) => {
    const uploaderStore = useUploaderStore();
    console.log({ uploaderStore })

    const items = uploaderStore.items[props.conversationId || ""] || [];

    return <WrappedComponent {...props} items={items} />;
  };
};

export const UploadPreview = withConversationUploads<{ render?: (props: { items: BatchItem[] }) => JSX.Element }>((props) => {
  if (props.render) {
    return props.render({ items: props.items });
  }

  return (
    <div>
      {props.items.map((item) => (
        <div key={item.id}>
          {item.file.name}
        </div>
      ))}
    </div>
  );
});