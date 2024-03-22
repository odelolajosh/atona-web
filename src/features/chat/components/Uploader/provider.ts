import { createContext } from "@/lib/context";
import type { Batch, BatchItem } from "@rpldy/shared";

export type UploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
}

export type FinalizedUpload = {
  itemId: string;
  batchId: string;
  response: UploadResponse;
}

type UploaderStoreType = {
  items: Record<string, BatchItem[]>;
  uploaded: Record<string, FinalizedUpload[]>;
  batchMap: Record<string, string>;
  addBatch: (conversationId: string, batch: Batch) => void;
  removeItem: (conversationId: string, item: BatchItem) => void;
  getItem: (conversationId: string, itemId: string) => BatchItem | undefined;
  finalizeItemUpload: (conversationId: string, item: BatchItem) => void;
  getItemUploadResponse: (conversationId: string, itemId: string) => UploadResponse | undefined;
  getUploadedItems: (conversationId: string) => UploadResponse[] | undefined;
  clearConversationUploads: (conversationId: string) => void;
}

export const [useUploaderStore, UploaderStoreProvider] = createContext<UploaderStoreType>("UploaderStore");