import JSZip from "jszip";

export async function POST({ request }) {
  const { images, itemId, printSize } = await request.json();

  const zip = new JSZip();
  let counter = 1;

  for (const img of images) {
    const response = await fetch(img.url);
    const arrayBuffer = await response.arrayBuffer();

    const ext = img.name.split('.').pop();
    const newName = `${printSize}-${itemId}-${counter}.${ext}`;

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