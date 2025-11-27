import { getImagesForItem } from "$lib/utils/getImagesForItem";

export async function downloadImagesRequest(item) {
  // 1. Get all Firebase image URLs for this item
  const images = await getImagesForItem(item.id);

  // 2. Send them to backend for renaming and zipping
  const res = await fetch('/api/zip-images', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      images,
      itemId: item.id,
      printSize: item.details?.size  // e.g., "5R"
    })
  });

  // 3. Get the ZIP blob from the response
  const blob = await res.blob();

  // 4. Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.id}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
