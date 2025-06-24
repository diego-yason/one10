import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';

export const user = writable<User | null>(null);

if (browser) {
    onAuthStateChanged(auth, (newUser) => {
        user.set(newUser);
    });
} 