// src/lib/utils/getImagesForItem.ts

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// Firestore imports are removed as the metadata array is passed directly
// import { db, doc, getDoc } from '$lib/services/firebase'; 

// Define the expected structure for the images array
interface ImageReference {
    id: string; // The UUID
    name: string; // The original filename (e.g., "myphoto.PNG")
}

// 🎯 The function now accepts the metadata array directly.
export async function getImagesForItem(metadata: ImageReference[]): Promise<{ url: string, name: string }[]> {
    
    if (!metadata || metadata.length === 0) {
        console.warn(`No image metadata received for retrieval.`);
        return [];
    }

    const storage = getStorage();
    const imageURLs: { url: string, name: string }[] = [];

    for (const meta of metadata) {
        
        // 1. Determine the file extension from the original filename (meta.name)
        const parts = meta.name.split('.');
        // Use the extension if available, otherwise assume 'jpeg' (based on your uploads)
        const fileExtension = parts.length > 1 ? parts.pop() : 'jpeg'; 
        
        // 2. CRITICAL CHANGE: CONSTRUCT THE STORAGE PATH WITH ONLY THE UUID (meta.id)
        // The file in storage is named: photo_print_orders/b2dd85bf-d7b9-402d-9390-a3687e2054a0
        const storagePath = `photo_print_orders/${meta.id}`; 
        const storageRef = ref(storage, storagePath); 
        
        try {
            const url = await getDownloadURL(storageRef);
            
            imageURLs.push({
                url: url,
                // Use the determined extension for the final zip file name (e.g., UUID.jpeg)
                // This ensures the staff member gets a usable file extension!
                name: `${meta.id}.${fileExtension}` 
            });
        } catch (e) {
            // Log the UUID and the path that failed for easier debugging
            console.error(`Failed to get download URL for UUID: ${meta.id} at path: ${storagePath}`, e);
        }
    }

    return imageURLs;
}

// 🚫 The fetchMetadataForItem function is no longer needed here.