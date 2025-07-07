import cloudinary from "./cloudinary";
import streamifier from "streamifier";

export async function uploadToCloudinaryBuffer(
  buffer: Buffer,
  folder: string,
  filename: string
) {
  return new Promise<{ url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: "auto" },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve({ url: result?.secure_url || "" });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
