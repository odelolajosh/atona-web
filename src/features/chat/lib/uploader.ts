import type { Batch, BatchItem } from "@rpldy/shared";
import * as zustand from "zustand"

type UploaderStore = {
  items: Record<string, BatchItem[]>;
  add: (conversationId: string, batch: Batch) => void;
  remove: (conversationId: string, item: BatchItem) => void;
}

export const useUploaderStore = zustand.create<UploaderStore>((set) => ({
  items: {},
  add: (conversationId, batch) => {
    set((state) => {
      const items = batch.items;
      if (!state.items[conversationId]) {
        state.items[conversationId] = items;
      } else {
        state.items[conversationId].push(...items);
      }
      return state;
    });
  },
  remove: (conversationId, item) => {
    set((state) => {
      const items = state.items[conversationId];
      if (items) {
        const index = items.indexOf(item);
        if (index !== -1) {
          items.splice(index, 1);
        }
      }
      return state;
    });
  },
}));
