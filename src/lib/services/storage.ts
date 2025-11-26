/**
 * TODO: Firebase storage helper: uploadTempImage(file, uid, onProgress) => { uploadId, storagePath, downloadURL, size, contentType }.
 */
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase'; // your client firebase init