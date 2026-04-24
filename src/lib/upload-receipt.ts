import cloudinary from "./cloudinary";
import type { UploadApiResponse } from "cloudinary";

export async function uploadReceipt(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "payment_receipts" }, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      })
      .end(buffer);
  });

  return result.secure_url;
}
