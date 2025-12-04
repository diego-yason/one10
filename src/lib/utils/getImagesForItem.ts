// src/lib/utils/getImagesForItem.ts

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '$lib/services/firebase'; // Assuming you have a Firebase DB instance
import { doc, getDoc } from 'firebase/firestore';

// Define the expected structure for the images array
interface ImageReference {
    id: string; 
}

// NOTE: This implementation is an assumption based on common Firebase/Firestore setups.
export async function getImagesForItem(orderItemId: string): Promise<{ url: string, name: string }[]> {
    
    const metadata: any[] = await fetchMetadataForItem(orderItemId); // You must implement this

    if (!metadata || metadata.length === 0) {
        console.warn(`No image metadata found for item ID: ${orderItemId}`);
        return [];
    }

    const storage = getStorage();
    const imageURLs: { url: string, name: string }[] = [];

    for (const meta of metadata) {
        // The file name in Firebase Storage is assumed to be the unique ID + its extension.
        // The original logic suggested 'id' is a UUID. Assuming 'meta.id.jpg' is the file name.
        
        // This is a CRITICAL assumption: You need to know the file extension.
        // If the extension is stored in the metadata, use it. E.g., const ext = meta.ext;
        
        const storageRef = ref(storage, `uploads/images/${meta.id}`); // Adjust path as needed
        
        try {
            const url = await getDownloadURL(storageRef);
            imageURLs.push({
                url: url,
                // Use a proper file name for the backend zipper to use
                name: `${meta.id}.jpg` // <<< Adjust extension (.jpg, .png) as per your storage
            });
        } catch (e) {
            console.error(`Failed to get download URL for image ID ${meta.id}`, e);
        }
    }

    return imageURLs;
}

// NOTE: You must implement this function to fetch the metadata array from your database.
async function fetchMetadataForItem(orderItemId: string): Promise<any[]> {
    // 1. Query your database for the order that contains orderItemId.
    // 2. Find the item within the order.
    // 3. Return the array of item.details.uploadedImages.
    
    return []; // Placeholder: Implement this logic
}