import firebase from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin/app';
import key from '../../../firebaseServiceKey.json';

export const admin = firebase.initializeApp({
	credential: firebase.credential.cert(key as ServiceAccount)
});

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
