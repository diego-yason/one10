import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "$lib/services/firebase";

export async function getImagesForItem(itemId: string) {
  const folderRef = ref(storage, `items/${itemId}/photos`);
  const listResult = await listAll(folderRef);

  const images = [];
  for (const refItem of listResult.items) {
    const url = await getDownloadURL(refItem);
    images.push({
      name: refItem.name,
      url
    });
  }

  return images;
}
