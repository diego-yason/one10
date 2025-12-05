import { describe, it, expect, beforeEach, vi } from 'vitest';

// --- Mock firebase/auth ---
const mockOnAuthStateChanged = vi.fn();

vi.mock('firebase/auth', () => ({
	onAuthStateChanged: mockOnAuthStateChanged,
}));

// --- Mock firebase service (with signOut) ---
const mockSignOut = vi.fn();
const mockAuth = { signOut: mockSignOut };

vi.mock('$lib/services/firebase', () => ({ auth: mockAuth }));

// --- Mock invalidate and environment ---
vi.mock('$app/navigation', () => ({ invalidate: vi.fn() }));

// Utility to dynamically import a fresh copy of the store
async function loadAuthStore() {
	vi.resetModules();

	// Simulate browser environment
	vi.doMock('$app/environment', () => ({ browser: true }));

	// Provide a fake `document` object (for cookie handling)
	globalThis.document = { cookie: '' } as any;

	return await import('./auth');
}

describe('auth store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('initializes with null user', async () => {
		const { user } = await loadAuthStore();
		let value: any;
		user.subscribe((v) => (value = v))();
		expect(value).toBeNull();
	});

	it('reacts to onAuthStateChanged updates', async () => {
		const fakeUser = {
			uid: '123',
			email: 'test@example.com',
			getIdToken: vi.fn().mockResolvedValue('fake-token'),
		};
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => callback(fakeUser));

		const { user } = await loadAuthStore();

		let value: any;
		user.subscribe((v) => (value = v))();

		expect(mockOnAuthStateChanged).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
		expect(value).toEqual(fakeUser);
	});

	it('sets isStaff = true for @one10studiolab.com emails', async () => {
		const staffUser = {
			uid: '1',
			email: 'dev@one10studiolab.com',
			getIdToken: vi.fn().mockResolvedValue('staff-token'),
		};
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => callback(staffUser));

		const { isStaff } = await loadAuthStore();

		let staffValue = false;
		isStaff.subscribe((v) => (staffValue = v))();

		expect(staffValue).toBe(true);
	});

	it('sets isStaff = false for non-staff emails', async () => {
		const normalUser = {
			uid: '2',
			email: 'random@gmail.com',
			getIdToken: vi.fn().mockResolvedValue('user-token'),
		};
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => callback(normalUser));

		const { isStaff } = await loadAuthStore();

		let staffValue = true;
		isStaff.subscribe((v) => (staffValue = v))();

		expect(staffValue).toBe(false);
		expect(mockSignOut).toHaveBeenCalled(); // ensure signOut triggered
	});
});
