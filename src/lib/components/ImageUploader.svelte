<script lang="ts">
  import imageCompression from "browser-image-compression";
  import { uploadTempImage } from "$lib/services/storage";
  import { user } from "$lib/stores/auth"; // assumes writable store { uid, ... }

  // --- Props ---
  export let accept = "image/*";
  export let maxFiles = 10;

  export let onUploaded: (result: any) => void;
  export let onError: (error: any) => void;
  export let onComplete: (data: { count: number }) => void;

  // --- Types ---
  type UploadItem = {
    file: File;
    preview: string;
    progress: number;
    uploaded: boolean;
    uploading: boolean;
    uploadId?: string;
    meta?: any;
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
      progress: 0,
      uploaded: false,
      uploading: false,
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

    for (const item of files) {
      try {
        item.uploading = true;
        const compressed = await compressImage(item.file);

        const printingOptions = {
          size: "4x6",
          quantity: 1,
          cropMode: "fit",
        };

        const result: any = await uploadTempImage(
          compressed,
          u.uid,
          printingOptions,
          (p) => (item.progress = p)
        );

        item.uploadId = result.uploadId;
        item.meta = result.meta;
        item.uploaded = true;
        item.uploading = false;
        onUploaded?.(result);
      } catch (err: any) {
        item.error = err?.message || "Upload failed";
        item.uploading = false;
        onError?.(item.error);
      }
    }

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

          {#if item.uploading}
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all"
                style="width: {item.progress}%"
              ></div>
            </div>
            <p class="text-sm text-gray-500">{item.progress}%</p>
          {:else if item.uploaded}
            <p class="text-green-600 font-medium">Uploaded ✓</p>
          {:else if item.error}
            <p class="text-red-500">{item.error}</p>
          {/if}
        </div>
      {/each}
    </div>

    <button
      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow disabled:opacity-50"
      on:click={startUploads}
      disabled={isUploading}
    >
      {isUploading ? "Uploading..." : "Start Uploads"}
    </button>
  {/if}
</div>
