export interface ServerImageFile {
  filename: string;
  storagePath: string; // e.g. orders/{orderId}/images/{filename}
  size: number;
  mimeType: string;
  downloadURL?: string; // optional, may store signed URL or public URL
  uploadedAt: FirebaseFirestore.Timestamp;
}

