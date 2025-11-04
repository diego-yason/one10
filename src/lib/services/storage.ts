/**
 * TODO: Firebase storage helper: uploadTempImage(file, uid, onProgress) => { uploadId, storagePath, downloadURL, size, contentType }.
 * 
 */
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase'; // your client firebase init

/**
 * Uploads a temporary image to Firebase Storage and saves metadata to Firestore.
 * @param {File} file - The image file to upload.
 * @param {string} uid - The user ID of the uploader.
 * @param {{ size: string, quantity: number, cropMode: string }} printingOptions - Options related to printing.
 * @param {(p: number) => void} [onProgress] - Optional callback for upload progress.
 * @returns {Promise<{ uploadId: string, storagePath: string, downloadURL: string, size: number, contentType: string }>} - The upload result.
 */
export async function uploadTempImage(file: File, uid: string, printingOptions: { size: string, quantity: number, cropMode: string }, onProgress?: (p: number) => void) {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const storagePath = `users/${uid}/uploads/${filename}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const meta = {
            ownerUid: uid,
            storagePath,
            downloadURL,
            size: file.size,
            contentType: file.type,
            printingOptions,
            createdAt: serverTimestamp()
          };
          const docRef = await addDoc(collection(db, 'uploads'), meta);
          resolve({ uploadId: docRef.id, storagePath, downloadURL, size: file.size, contentType: file.type });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}