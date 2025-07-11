import type { Product } from '$types/products';
import {
	type Firestore,
	addDoc,
	collection,
	query,
	orderBy,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	deleteDoc
} from 'firebase/firestore';
import {
	type FirebaseStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject
} from 'firebase/storage';
import { FirebaseService } from './firebase';

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

		return querySnapshot.docs.map((doc) => ({
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
	async updateProduct(
		id: string,
		updates: Partial<Omit<Product, 'id' | 'createdAt'>>
	): Promise<void> {
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
