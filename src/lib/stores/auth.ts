import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';

export const user = writable<User | null>(null);

// Function to check if a user is staff
export function isStaffUser(user: User | null): boolean {
	return user?.email?.endsWith('@one10studiolab.com') ?? false;
}

if (browser) {
    onAuthStateChanged(auth, (newUser) => {
        user.set(newUser);
    });
} 