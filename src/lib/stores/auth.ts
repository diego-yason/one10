import { writable } from 'svelte/store';
import { auth } from '$lib/services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';

export const user = writable<User | null>(null);
export const isStaff = writable(false);
export const authLoaded = writable(false);

user.subscribe((user) => isStaff.set(user?.email?.endsWith('@one10studiolab.com') ?? false));

if (browser) {
	onAuthStateChanged(auth, (newUser) => {
		user.set(newUser);
		authLoaded.set(true);
	});
}
