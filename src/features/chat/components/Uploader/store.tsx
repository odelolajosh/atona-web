import type { Batch, BatchItem } from "@rpldy/shared";
import { useCallback, useMemo, useState } from "react";
import { FinalizedUpload, UploadResponse, UploaderStoreProvider } from "./provider";
import { destroyUpload } from "./api";

export const UploaderStore = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Record<string, BatchItem[]>>({});
  const [batchMap, setBatchMap] = useState<Record<string, string>>({});
  const [uploaded, setUploaded] = useState<Record<string, FinalizedUpload[]>>({});

  const addBatch = useCallback((conversationId: string, batch: Batch) => {
    setItems((prev) => {
      const state = { ...prev };
      const items = batch.items;
      if (!state[conversationId]) {
        state[conversationId] = items;
      } else {
        state[conversationId] = state[conversationId].concat(items);
      }
      return state;
    });
    setBatchMap((prev) => {
      const state = { ...prev };
      state[batch.id] = conversationId;
      return state;
    });
  }, []);

  const removeItem = useCallback(async (conversationId: string, item: BatchItem) => {
    const batchId = item.batchId;
    // check if an item of the same batch is still in the store
    const isBatchStillInStore = items[conversationId]?.some((i) => i.batchId === batchId);
    if (!isBatchStillInStore) {
      setBatchMap((state) => {
        delete state[batchId];
        return state;
      });
    }

    // remove from items
    setItems((prev) => {
      const state = { ...prev };
      if (state[conversationId]) {
        state[conversationId] = state[conversationId].filter((i) => i.id !== item.id);
      }
      return state;
    });

    // Remove from uploaded
    const uploadedItem = uploaded[conversationId]?.find((i) => i.itemId === item.id);
    if (uploadedItem) {
      await destroyUpload(uploadedItem.response);
    }

    setUploaded((prev) => {
      const state = { ...prev };
      if (state[conversationId]) {
        state[conversationId] = state[conversationId].filter((i) => i.itemId !== item.id);
      }
      return state;
    });
  }, [items, uploaded]);

  const finalizeItemUpload = useCallback((conversationId: string, item: BatchItem) => {
    setUploaded((prev) => {
      const data = item.uploadResponse?.data?.result as UploadResponse;
      if (!data) {
        return prev;
      }

      const state = { ...prev };
      const finalizedUpload: FinalizedUpload = {
        itemId: item.id,
        batchId: item.batchId,
        response: data,
      };
      if (state[conversationId]) {
        state[conversationId] = state[conversationId].concat(finalizedUpload);
      } else {
        state[conversationId] = [finalizedUpload];
      }
      return state;
    });

    // update the item in the items store to this new item
    setItems((prev) => {
      const state = { ...prev };
      if (state[conversationId]) {
        const index = state[conversationId].findIndex((i) => i.id === item.id);
        if (index !== -1) {
          state[conversationId][index] = item;
        }
      }
      return state;
    });
  }, []);

  const getItemUploadResponse = useCallback((conversationId: string, itemId: string) => {
    return uploaded[conversationId]?.find((i) => i.itemId === itemId)?.response;
  }, [uploaded]);

  const getUploadedItems = useCallback((conversationId: string) => {
    return uploaded[conversationId]?.map((i) => i.response);
  }, [uploaded]);

  const getItem = useCallback((conversationId: string, itemId: string) => {
    return items[conversationId]?.find((i) => i.id === itemId);
  }, [items]);

  const clearConversationUploads = useCallback((conversationId: string) => {
    setItems((prev) => {
      const state = { ...prev };
      delete state[conversationId];
      return state;
    });

    setUploaded((prev) => {
      const state = { ...prev };
      delete state[conversationId];
      return state;
    });

    setBatchMap((prev) => {
      const state = { ...prev };
      Object.keys(state).forEach((key) => {
        if (state[key] === conversationId) {
          delete state[key];
        }
      });
      return state;
    });
  }, []);

  const values = useMemo(() => ({
    items,
    uploaded,
    batchMap,
    addBatch,
    removeItem,
    getItem,
    finalizeItemUpload,
    getItemUploadResponse,
    getUploadedItems,
    clearConversationUploads,
  }), [items, uploaded, batchMap, addBatch, removeItem, getItem, finalizeItemUpload, getItemUploadResponse, getUploadedItems, clearConversationUploads]);

  return (
    <UploaderStoreProvider {...values}>
      {children}
    </UploaderStoreProvider>
  )
}