import JSZip from "jszip";

export async function POST({ request }) {
  // We assume the incoming 'images' array contains the full metadata for each image,
  // including copies, fitMode, size, and the correct name (UUID.ext).
  const { images, itemId } = await request.json(); // Removed printSize, as it's in the image metadata

  const zip = new JSZip();
  let counter = 1;
  for (const img of images) {
    const response = await fetch(img.url);
    const arrayBuffer = await response.arrayBuffer();

    // The 'name' property from getImagesForItem is formatted as 'UUID.ext'
    const parts = img.name.split('.');
    // The file extension (e.g., 'jpg', 'png')
    const ext = parts.length > 1 ? parts.pop() : 'file'; 
    
    // Use the desired metadata fields to construct the new filename:
    // Format: [Counter]-[Size]x[Copies]-[FitMode]-[ItemID].[ext]
    // Example: 01-5R-x2-crop-order_123.jpeg
    const newName = `${counter}-${img.size}x${img.copies}-${img.fitMode}.${ext}`;

    zip.file(newName, arrayBuffer);
    counter++;
  }

  // generate ZIP as Uint8Array
  const zipData = await zip.generateAsync({ type: "uint8array" });

  // Create a new Uint8Array with proper ArrayBuffer type
  const properUint8Array = new Uint8Array(zipData);

  return new Response(new Blob([properUint8Array]), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${itemId}.zip"`
    }
  });
}