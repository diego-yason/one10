<script lang="ts">
  import imageCompression from "browser-image-compression";
  //import { uploadTempImage } from "$lib/services/storage";
  import { user } from "$lib/stores/auth"; // assumes writable store { uid, ... }

  // --- Props ---
  export let accept = "image/png, image/jpeg, image/jpg";
  export let maxFiles = 10;

  export let onUploaded: (f: File[]) => void;
  export let onError: (error: any) => void;
  export let onComplete: (data: { count: number }) => void;

  // --- Types ---
  type UploadItem = {
    file: File;
    preview: string;
    error?: string;
  };

  // --- State ---
  let files: UploadItem[] = [];
  let isUploading = false;

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const selected = Array.from(input.files).slice(0, maxFiles);
    files = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
  }

  async function compressImage(file: File): Promise<File> {
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 4000,
        useWebWorker: true,
      };
      return await imageCompression(file, options);
    } catch {
      return file;
    }
  }

  async function startUploads() {
    if (files.length === 0) return;
    const u = $user;
    if (!u?.uid) {
      onError?.("You must be logged in to upload files.");
      return;
    }

    isUploading = true;
    const compressed_files: File[] = [];
    for (const item of files) {
      try {
        const compressed = await compressImage(item.file);
        compressed_files.push(compressed)
      } catch (err: any) {
        onError?.(item.error);
      }
    }

    onUploaded?.(compressed_files);

    isUploading = false;
    onComplete?.({ count: files.length });
  }
</script>

<div class="flex flex-col items-center w-full space-y-4 p-4">
  <!-- Select button -->
  <label
    class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
  >
    Select Images
    <input
      type="file"
      accept={accept}
      multiple
      on:change={handleFileChange}
      class="hidden"
    />
  </label>

  {#if files.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {#each files as item, i}
        <div
          class="relative bg-white dark:bg-gray-800 shadow-md rounded-2xl p-3 border border-gray-200 flex flex-col items-center space-y-2"
        >
          <img
            src={item.preview}
            alt={`preview-${i}`}
            class="w-full h-40 object-cover rounded-lg"
          />

        </div>
      {/each}
    </div>
  {/if}
</div>
