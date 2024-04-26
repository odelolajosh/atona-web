import { useCallback, useMemo } from "react";
import { useUploaderStore } from ".";
import { FILE_STATES, useAbortItem, useItemProgressListener } from "@rpldy/uploady";

// useUploaderPreview hook
export const useUploaderPreview = (conversationId: string) => {
  const uploaderStore = useUploaderStore("useUploaderPreview");

  const isUploading = useMemo(() => {
    const items = uploaderStore.items[conversationId] || [];
    return items.some((item) => [FILE_STATES.ADDED, FILE_STATES.UPLOADING].includes(item.state));
  }, [conversationId, uploaderStore.items]);
  
  const items = uploaderStore.items[conversationId] || [];

  return {
    items,
    isUploading
  };
}

// useUploaderPreviewItem hook
export const useUploaderPreviewItem = (conversationId: string, itemId: string) => {
  const uploaderStore = useUploaderStore("useUploaderPreviewItem");

  const progress = useItemProgressListener(itemId);

  const completed = useMemo(() => {
    if (progress) return progress.completed;

    const uploadResponse = uploaderStore.getItemUploadResponse(conversationId, itemId);
    return uploadResponse ? 100 : 0;
  }, [progress, uploaderStore, conversationId, itemId]);

  const item = useMemo(() => {
    return uploaderStore.getItem(conversationId, itemId);
  }, [uploaderStore, conversationId, itemId]);

  const abortItem = useAbortItem();

  const remove = useCallback(async () => {
    if (!item) return;
    abortItem(item.id);
    uploaderStore.removeItem(conversationId, item);
  }, [item, uploaderStore, conversationId, abortItem]);

  return {
    item,
    progress: completed,
    remove,
  };
}