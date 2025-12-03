import { openDB } from "idb";

export async function getDB() {
    return openDB("cartImages", 2, { // Increment version
        upgrade(db, oldVersion) {
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images");
            }
            // New store for form state
            if (oldVersion < 2 && !db.objectStoreNames.contains("formState")) {
                db.createObjectStore("formState");
            }
        }
    });
}

export async function saveImage(id: string, file: File) {
    const db = await getDB();
    await db.put("images", file, id);
}

export async function getImage(id: string): Promise<File | null> {
    const db = await getDB();
    return await db.get("images", id);
}

export async function deleteImage(id: string) {
    const db = await getDB();
    await db.delete("images", id);
}

export async function clearImages() {
    const db = await getDB();
    await db.clear("images");
}

// New functions for persisting form state
export async function saveFormState(state: {
    uploadedImages: any[];
    pickupMode: string;
    pickupOther: string;
    total: number;
}) {
    const db = await getDB();
    // Store without the File objects and preview URLs
    const serializable = {
        ...state,
        uploadedImages: state.uploadedImages.map(img => ({
            id: img.id,
            name: img.name,
            copies: img.copies,
            size: img.size,
            price: img.price,
            fitMode: img.fitMode
        }))
    };
    await db.put("formState", serializable, "printingForm");
}

export async function getFormState() {
    const db = await getDB();
    return await db.get("formState", "printingForm");
}

export async function clearFormState() {
    const db = await getDB();
    await db.delete("formState", "printingForm");
}