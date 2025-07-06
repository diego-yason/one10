// Code taken from @code-gio/firekit
/**
 *  quick note on why taking code from @code-gio/firekit instead of importing it directly:
 *   1. firekit already solved the annoying problem of firebase initialization in SvelteKit
 *   2. firekit is MIT licensed.
 *   3. firekit is on alpha, and doesn't seem to be updated anymore, need to separate it
 *      so we have total control over the code.
 *   4. on that note, firekit has some sort of default user store, don't like that.
 *
 *
 * 	documentation comments copied from the original code.
 */

/// config parser
import type { FirebaseOptions } from 'firebase/app';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public';

/**
 * Singleton class that manages Firebase configuration.
 * Implements the Singleton pattern to ensure only one Firebase config instance exists.
 *
 * @example
 * // Get Firebase configuration
 * const config = FirebaseConfig.getInstance().getConfig();
 *
 * // Initialize Firebase app
 * const app = initializeApp(config);
 *
 * @throws {Error} If any required Firebase configuration variables are missing
 */
class FirebaseConfig {
	private static instance: FirebaseConfig;
	private readonly config: FirebaseOptions;

	/**
	 * Private constructor to prevent direct instantiation.
	 * Validates all required environment variables are present and creates config.
	 *
	 * @private
	 * @throws {Error} If any required Firebase configuration variables are missing
	 */
	private constructor() {
		const missingVars = this.getMissingFirebaseConfigVars();
		if (missingVars.length > 0) {
			throw Error(
				`The following Firebase configuration variables are missing: ${missingVars.join(', ')}`
			);
		}

		this.config = {
			apiKey: PUBLIC_FIREBASE_API_KEY,
			authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: PUBLIC_FIREBASE_APP_ID,
			measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
		};
	}

	/**
	 * Checks for missing required Firebase configuration variables.
	 *
	 * @private
	 * @returns {string[]} Array of missing environment variable names
	 */
	private getMissingFirebaseConfigVars(): string[] {
		const requiredVars = {
			PUBLIC_FIREBASE_API_KEY: PUBLIC_FIREBASE_API_KEY,
			PUBLIC_FIREBASE_AUTH_DOMAIN: PUBLIC_FIREBASE_AUTH_DOMAIN,
			PUBLIC_FIREBASE_PROJECT_ID: PUBLIC_FIREBASE_PROJECT_ID,
			PUBLIC_FIREBASE_STORAGE_BUCKET: PUBLIC_FIREBASE_STORAGE_BUCKET,
			PUBLIC_FIREBASE_MESSAGING_SENDER_ID: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			PUBLIC_FIREBASE_APP_ID: PUBLIC_FIREBASE_APP_ID,
			PUBLIC_FIREBASE_MEASUREMENT_ID: PUBLIC_FIREBASE_MEASUREMENT_ID
		};

		return Object.entries(requiredVars)
			.filter(([_, value]) => !value)
			.map(([key]) => key);
	}

	/**
	 * Gets the singleton instance of FirebaseConfig.
	 * Creates a new instance if one doesn't exist.
	 *
	 * @returns {FirebaseConfig} The singleton FirebaseConfig instance
	 * @throws {Error} If any required Firebase configuration variables are missing
	 */
	static getInstance(): FirebaseConfig {
		if (!FirebaseConfig.instance) {
			FirebaseConfig.instance = new FirebaseConfig();
		}
		return FirebaseConfig.instance;
	}

	/**
	 * Gets the Firebase configuration options.
	 *
	 * @returns {FirebaseOptions} The Firebase configuration options
	 */
	getConfig(): FirebaseOptions {
		return this.config;
	}
}

/**
 * Pre-initialized Firebase configuration instance.
 * Use this to get Firebase configuration options directly.
 *
 * @example
 * import { firebaseConfig } from './firebase-config';
 * import { initializeApp } from 'firebase/app';
 *
 * const app = initializeApp(firebaseConfig);
 */
const firebaseConfig = FirebaseConfig.getInstance().getConfig();

/// firebase initialization
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
	initializeFirestore,
	CACHE_SIZE_UNLIMITED,
	type Firestore,
	persistentLocalCache,
	persistentMultipleTabManager,
	enablePersistentCacheIndexAutoCreation,
	getPersistentCacheIndexManager
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getFunctions, type Functions } from 'firebase/functions';
import { getDatabase, type Database } from 'firebase/database';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { browser } from '$app/environment';
import { 
	collection, 
	doc, 
	addDoc, 
	updateDoc, 
	deleteDoc, 
	getDocs, 
	getDoc,
	query,
	orderBy,
	type DocumentData,
	type QueryDocumentSnapshot,
	setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Singleton service class that manages Firebase service instances.
 * Handles initialization and access to Firebase app and its various services.
 *
 * @example
 * // Get Firestore instance
 * const db = firebaseService.getDbInstance();
 *
 * // Get Auth instance
 * const auth = firebaseService.getAuthInstance();
 */
class FirebaseService {
	private static instance: FirebaseService;
	private firebaseApp: FirebaseApp | null = null;
	private db: Firestore | null = null;
	private auth: Auth | null = null;
	private functions: Functions | null = null;
	private database: Database | null = null;
	private storage: FirebaseStorage | null = null;

	private constructor() {}

	/**
	 * Gets the singleton instance of FirebaseService.
	 * Creates a new instance if one doesn't exist.
	 *
	 * @returns {FirebaseService} The singleton FirebaseService instance
	 */
	static getInstance(): FirebaseService {
		if (!FirebaseService.instance) FirebaseService.instance = new FirebaseService();
		return FirebaseService.instance;
	}

	/**
	 * Initializes or retrieves the Firebase app instance.
	 * Also initializes Firestore if running in browser environment.
	 *
	 * @returns {FirebaseApp} The Firebase app instance
	 */
	getFirebaseApp(): FirebaseApp {
		if (this.firebaseApp) return this.firebaseApp;

		const existingApps = getApps();
		if (existingApps.length) {
			this.firebaseApp = existingApps[0];
		} else {
			this.firebaseApp = initializeApp(firebaseConfig);
			console.log(`${firebaseConfig.projectId} initialized on ${browser ? 'client' : 'server'}`);
		}

		this.initializeFirestoreInstance();
		return this.firebaseApp;
	}

	/**
	 * Initializes Firestore with persistent cache and multi-tab support.
	 * Only runs in browser environment.
	 *
	 * @private
	 */
	private initializeFirestoreInstance(): void {
		if (this.db || !browser) return;

		this.db = initializeFirestore(this.firebaseApp as FirebaseApp, {
			localCache: persistentLocalCache({
				cacheSizeBytes: CACHE_SIZE_UNLIMITED,
				tabManager: persistentMultipleTabManager()
			})
		});

		const indexManager = getPersistentCacheIndexManager(this.db);
		if (indexManager) {
			enablePersistentCacheIndexAutoCreation(indexManager);
			console.log('Firestore persistent cache indexing is enabled');
		} else {
			console.warn('Failed to initialize the Firestore cache index manager');
		}
	}

	/**
	 * Gets the Firestore instance, initializing it if necessary.
	 *
	 * @returns {Firestore} The Firestore instance
	 */
	getDbInstance(): Firestore {
		if (!this.db) this.getFirebaseApp();
		return this.db as Firestore;
	}

	/**
	 * Gets the Authentication instance, initializing it if necessary.
	 *
	 * @returns {Auth} The Authentication instance
	 */
	getAuthInstance(): Auth {
		if (!this.auth) this.auth = getAuth(this.getFirebaseApp());
		return this.auth;
	}

	/**
	 * Gets the Cloud Functions instance, initializing it if necessary.
	 *
	 * @returns {Functions} The Cloud Functions instance
	 */
	getFunctionsInstance(): Functions {
		if (!this.functions) this.functions = getFunctions(this.getFirebaseApp());
		return this.functions;
	}

	/**
	 * Gets the Realtime Database instance, initializing it if necessary.
	 *
	 * @returns {Database} The Realtime Database instance
	 */
	getDatabaseInstance(): Database {
		if (!this.database) this.database = getDatabase(this.getFirebaseApp());
		return this.database;
	}

	/**
	 * Gets the Storage instance, initializing it if necessary.
	 *
	 * @returns {FirebaseStorage} The Storage instance
	 */
	getStorageInstance(): FirebaseStorage {
		if (this.storage) return this.storage;
		this.storage = getStorage(this.getFirebaseApp());
		return this.storage;
	}
}

/**
 * Pre-initialized Firebase service instance.
 * Use this to access Firebase services directly.
 *
 * @example
 * import { firebaseService } from './firebase-service';
 *
 * // Get Firestore
 * const db = firebaseService.getDbInstance();
 *
 * // Get Auth
 * const auth = firebaseService.getAuthInstance();
 */
export const firebase = FirebaseService.getInstance();
export const auth = firebase.getAuthInstance();
export const db = firebase.getDbInstance();
export const functions = firebase.getFunctionsInstance();
export const database = firebase.getDatabaseInstance();
export const storage = firebase.getStorageInstance();

// Product management functions
export interface Product {
	id?: string;
	itemCode: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	status: 'available' | 'not_available' | 'out_of_stock';
	imageUrl?: string;
	category: string;
	expiryDate?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class ProductService {
	private static instance: ProductService;
	private db: Firestore;
	private storage: FirebaseStorage;

	private constructor() {
		const firebaseService = FirebaseService.getInstance();
		this.db = firebaseService.getDbInstance();
		this.storage = firebaseService.getStorageInstance();
	}

	static getInstance(): ProductService {
		if (!ProductService.instance) {
			ProductService.instance = new ProductService();
		}
		return ProductService.instance;
	}

	/**
	 * Add a new product to Firestore
	 */
	async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		const now = new Date();
		const product: Omit<Product, 'id'> = {
			...productData,
			createdAt: now,
			updatedAt: now
		};

		const docRef = await addDoc(collection(this.db, 'products'), product);
		return docRef.id;
	}

	/**
	 * Get all products from Firestore
	 */
	async getProducts(): Promise<Product[]> {
		const q = query(collection(this.db, 'products'), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		
		return querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		})) as Product[];
	}

	/**
	 * Get a single product by ID
	 */
	async getProduct(id: string): Promise<Product | null> {
		const docRef = doc(this.db, 'products', id);
		const docSnap = await getDoc(docRef);
		
		if (docSnap.exists()) {
			return {
				id: docSnap.id,
				...docSnap.data()
			} as Product;
		}
		return null;
	}

	/**
	 * Update a product
	 */
	async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
		const docRef = doc(this.db, 'products', id);
		await updateDoc(docRef, {
			...updates,
			updatedAt: new Date()
		});
	}

	/**
	 * Delete a product
	 */
	async deleteProduct(id: string): Promise<void> {
		const docRef = doc(this.db, 'products', id);
		await deleteDoc(docRef);
	}

	/**
	 * Upload product image to Firebase Storage
	 */
	async uploadProductImage(file: File, productId: string): Promise<string> {
		const storageRef = ref(this.storage, `products/${productId}/${file.name}`);
		const snapshot = await uploadBytes(storageRef, file);
		const downloadURL = await getDownloadURL(snapshot.ref);
		return downloadURL;
	}

	/**
	 * Delete product image from Firebase Storage
	 */
	async deleteProductImage(imageUrl: string): Promise<void> {
		const imageRef = ref(this.storage, imageUrl);
		await deleteObject(imageRef);
	}
}

// CartService for user cart storage in Firestore
export class CartService {
	private static instance: CartService;
	private db: Firestore;

	private constructor() {
		const firebaseService = FirebaseService.getInstance();
		this.db = firebaseService.getDbInstance();
	}

	static getInstance(): CartService {
		if (!CartService.instance) {
			CartService.instance = new CartService();
		}
		return CartService.instance;
	}

	async getCart(userId: string): Promise<any[]> {
		const docRef = doc(this.db, 'carts', userId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data().items || [];
		}
		return [];
	}

	async setCart(userId: string, items: any[]): Promise<void> {
		const docRef = doc(this.db, 'carts', userId);
		await setDoc(docRef, { items }, { merge: true });
	}

	async clearCart(userId: string): Promise<void> {
		const docRef = doc(this.db, 'carts', userId);
		await setDoc(docRef, { items: [] }, { merge: true });
	}
}
