import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: ''
});

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
	onAuthStateChanged: vi.fn(),
	signInWithEmailAndPassword: vi.fn(),
	signInWithPopup: vi.fn(),
	signOut: vi.fn(),
	GoogleAuthProvider: vi.fn(),
	FacebookAuthProvider: vi.fn(),
	getAuth: vi.fn(() => ({
		signOut: vi.fn()
	}))
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
	collection: vi.fn(),
	doc: vi.fn(),
	getDoc: vi.fn(),
	getDocs: vi.fn(async() => ({
        docs: [
            { id: '1', data: () => ({ name: 'Test Product', price: 9.99 })},
            { id: '2', data: () => ({ name: 'Another Product', price: 14.99 })},
        ]
    })),
	query: vi.fn(),
	where: vi.fn(),
    orderBy: vi.fn(),
	limit: vi.fn(),
	setDoc: vi.fn(),
	initializeFirestore: vi.fn(),
	CACHE_SIZE_UNLIMITED: 1,
	persistentLocalCache: vi.fn(),
	persistentMultipleTabManager: vi.fn(),
	enablePersistentCacheIndexAutoCreation: vi.fn(),
	getPersistentCacheIndexManager: vi.fn()
}));

// Mock Firebase App
vi.mock('firebase/app', () => {
    const fakeApp = {
        name: '[DEFAULT]',
        options: {},
        _container: {
            getProvider: vi.fn(() => ({
                getImmediate: vi.fn(() => ({}))
            }))
        }
    };

    return {
        initializeApp: vi.fn(() => fakeApp),
        getApps: vi.fn(() => [fakeApp]),
        getApp: vi.fn(() => fakeApp),
        getAuth: vi.fn(() => ({ signOut: vi.fn() })),
        getFirestore: vi.fn(() => ({ _fakeFirestore: true })),
        getFunctions: vi.fn(() => ({ _fakeFunctions: true })),
        getDatabase: vi.fn(() => ({ _fakeDb: true })),
        getStorage: vi.fn(() => ({ _fakeStorage: true })),
    };
});

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({ _fakeFunctions: true })),
    httpsCallable: vi.fn(() => vi.fn())
}));

// Mock SvelteKit environment
vi.mock('$app/environment', () => ({
	browser: true,
	dev: false,
	prerendering: false,
	version: '1.0.0'
}));

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
	invalidate: vi.fn(),
	goto: vi.fn()
}));

// Mock Firebase Database
vi.mock('firebase/database', () => ({
    getDatabase: vi.fn(() => ({ _fakeDb: true })),
    ref: vi.fn(),
    set: vi.fn(),
    push: vi.fn(),
    onValue: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
}));

// Mock Firebase Storage
vi.mock('firebase/storage', () => ({
    getStorage: vi.fn(() => ({ _fakeStorage: true })),
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
}));

// Reset all mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
	localStorageMock.getItem.mockReturnValue(null);
	localStorageMock.setItem.mockClear();
	localStorageMock.removeItem.mockClear();
	localStorageMock.clear.mockClear();
});
