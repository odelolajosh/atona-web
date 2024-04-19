import Uploady, { useBatchAddListener, useItemAbortListener, useItemFinalizeListener } from "@rpldy/uploady";
import { asUploadButton } from "@rpldy/upload-button";
import { getMockSenderEnhancer } from "@rpldy/mock-sender";
import type { Batch, BatchItem } from "@rpldy/shared";
import { FC, PropsWithChildren } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useChat } from "../../hooks/use-chat";
import { UploaderStore } from "./store";
import { useUploaderStore } from ".";
import { UPLOAD_API_URL } from "./api";

const __DEV__ = false;

const mockSenderEnhancer = getMockSenderEnhancer({ delay: 1000 * 1.5 });

export const UploadProvider: FC<PropsWithChildren> = ({ children }) => {
  const enhancer = __DEV__ ? mockSenderEnhancer : undefined;

  return (
    <UploaderStore>
      <Uploady
        debug={__DEV__}
        destination={{
          url: `${UPLOAD_API_URL}/upload`,
        }}
        enhancer={enhancer}
      >
        <Uploader>
          {children}
        </Uploader>
      </Uploady>
    </UploaderStore>
  )
}

export const Uploader = ({ children }: { children: React.ReactNode }) => {
  const { activeConversation } = useChat();
  const uploaderStore = useUploaderStore("Uploader");

  useBatchAddListener((batch: Batch) => {
    if (!activeConversation?.id) {
      return false;
    }
    batch.additionalInfo = activeConversation.id;
    uploaderStore.addBatch(activeConversation.id, batch);
  });

  useItemFinalizeListener((item) => {
    const batchId = item.batchId;
    const conversationId = uploaderStore.batchMap[batchId];
    if (conversationId) {
      uploaderStore.finalizeItemUpload(conversationId, item);
    }
  });

  useItemAbortListener(async (item) => {
    const batchId = item.batchId;
    const conversationId = uploaderStore.batchMap[batchId];
    if (conversationId) {
      uploaderStore.removeItem(conversationId, item);
    }
  });

  return children;
}

export const UploadButton = asUploadButton((props: PropsWithChildren) => (
  <Slot {...props} />
));

export type PreviewComponentProps = {
  items: BatchItem[]
  removeItem: (itemId: string) => void
}