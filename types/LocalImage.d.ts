export interface LocalImageFile {
  file: File;
  previewUrl: string;
  id: string; // unique ID for tracking (uuid or timestamp)
}
