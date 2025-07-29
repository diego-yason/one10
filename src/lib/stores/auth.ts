import { writable } from 'svelte/store';
import { auth } from '$lib/services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';

export const user = writable<User | null>(null);
export const isStaff = writable(false);
export const authLoaded = writable(false);

user.subscribe((user) => isStaff.set(user?.email?.endsWith('@one10studiolab.com') ?? false));

let userStatic: User | null | undefined = undefined;
user.subscribe((u) => (userStatic = u));
let authLoadedStatic = false;
authLoaded.subscribe((loaded) => (authLoadedStatic = loaded));

if (browser) {
	onAuthStateChanged(auth, (newUser) => {
		// invalidate if authLoaded and userStatic was a user and now is null
		// aka a logout
		if (authLoadedStatic && userStatic && !newUser) {
			console.warn("User logged out, invalidating 'user'");
			invalidate('auth:user');
		}

		user.set(newUser);
		authLoaded.set(true);

		// staff only for now
		if (newUser && !newUser.email?.endsWith('@one10studiolab.com')) {
			return auth.signOut();
		}

		// expire any existing session cookie
		document.cookie =
			'__session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure; HttpOnly';

		// set cookie
		if (newUser)
			document.cookie = `__session=${newUser.getIdToken()}; path=/; SameSite=Strict; Secure; HttpOnly`;
	});
}
