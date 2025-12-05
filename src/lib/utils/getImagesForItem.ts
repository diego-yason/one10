// src/lib/utils/getImagesForItem.ts

import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// 1. Define the full structure of the image metadata passed in.
interface ImageReference {
    id: string; 
    name: string;
    copies: number; // Added: Required for +server.ts
    fitMode: string; // Added: Required for +server.ts
    size: string; // Added: Required for +server.ts
    price: number;
    // Add any other fields you want to pass through
}

// 2. Define the new return type that includes the necessary fields
// This is the data structure that will be sent to the /api/zip-images endpoint
interface ZippableImage extends ImageReference {
    url: string; // The generated download URL
    name: string; // The generated filename (UUID.ext)
}


// 🎯 CHANGE: Update the function signature to use the full ZippableImage type for its promise
export async function getImagesForItem(metadata: ImageReference[]): Promise<ZippableImage[]> {
    
    if (!metadata || metadata.length === 0) {
        console.warn(`No image metadata received for retrieval.`);
        return [];
    }

    const storage = getStorage();
    const imageURLs: ZippableImage[] = [];

    for (const meta of metadata) {
        
        // 1. Determine the file extension from the original filename (meta.name)
        const parts = meta.name.split('.');
        // Use the extension if available, otherwise assume 'jpeg' (based on your uploads)
        const fileExtension = parts.length > 1 ? parts.pop() : 'jpeg'; 
        
        // 2. CONSTRUCT THE STORAGE PATH (Uses UUID only, based on your storage images)
        const storagePath = `photo_print_orders/${meta.id}`; 
        const storageRef = ref(storage, storagePath); 
        
        try {
            const url = await getDownloadURL(storageRef);
            
            imageURLs.push({
                // Pass all original metadata fields through
                ...meta, 
                url: url,
                // Use the determined extension for the final zip file name
                name: `${meta.id}.${fileExtension}` 
            });
        } catch (e) {
            console.error(`Failed to get download URL for UUID: ${meta.id} at path: ${storagePath}`, e);
        }
    }

    return imageURLs;
}