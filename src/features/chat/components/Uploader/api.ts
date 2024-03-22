import axios from "axios"
import { UploadResponse } from ".";

export const UPLOAD_API_URL = `http://localhost:5500/api`;

export const destroyUpload = async (upload: UploadResponse) => {
  await axios.delete(`${UPLOAD_API_URL}/delete/${upload.public_id}`);
}