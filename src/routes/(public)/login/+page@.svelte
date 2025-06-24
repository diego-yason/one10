<script lang="ts">
	import { z } from 'zod/v4';
	import { auth } from '$lib/firebase';
	import {
		FacebookAuthProvider,
		GoogleAuthProvider,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { goto } from '$app/navigation';

	const loginSchema = z.object({
		email: z.string().email("Please enter a valid email address."),
		password: z.string().min(6, "Password must be at least 6 characters."),
	});

	let email = '';
	let password = '';
	let errorMessages: string[] = [];

	function getFirebaseErrorMessage(error: any): string {
		if (!error || typeof error.code !== 'string') return 'An unknown error occurred.';

		switch (error.code) {
			case 'auth/email-already-in-use':
				return 'This email is already registered.';
			case 'auth/invalid-email':
				return 'The email address is invalid.';
			case 'auth/user-not-found':
				return 'No account found with this email.';
			case 'auth/wrong-password':
				return 'Incorrect password.';
			case 'auth/weak-password':
				return 'Password should be at least 6 characters.';
			case 'auth/popup-closed-by-user':
				return 'The sign-in popup was closed before completing the sign in.';
			case 'auth/popup-blocked':
				return 'The sign-in popup was blocked by your browser.';
			case 'auth/network-request-failed':
				return 'Network error. Please check your connection and try again.';
			default:
				return error.message || 'An unknown error occurred.';
		}
	}

	const handleEmailLogin = async (e: SubmitEvent) => {
		e.preventDefault();
		errorMessages = [];

		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			if (result.error && Array.isArray(result.error.errors)) {
				errorMessages = result.error.errors.map(e => e.message);
			} else {
				errorMessages = ['Invalid input.'];
			}
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/staff-design');
			} else {
				goto('/');
			}
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const googleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, new GoogleAuthProvider());
			const user = result.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/staff-design');
			} else {
				goto('/');
			}
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const facebookLogin = async () => {
		try {
			const result = await signInWithPopup(auth, new FacebookAuthProvider());
			const user = result.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/staff-design');
			} else {
				goto('/');
			}
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};
</script>

<div class="login-container">
	<div class="mx-auto w-96 text-gray-100">
		<!-- TODO: add 110 logo -->
		<!-- TODO: add "Studio" outline -->
		<span class="text-4xl font-spaceGrotesk font-bold">
			<img src="https://placehold.co/60x50" alt="" class="inline" />
			<span class="textOutline text-transparent">Studio</span> Lab
		</span>

		<div class="mb-7 mt-10">
			<p class="text-xs">Welcome back</p>
			<h1 class="font-spaceGrotesk text-3xl font-bold">Login to your account</h1>
		</div>

		{#if errorMessages.length}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
				<ul>
					{#each errorMessages as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form on:submit={handleEmailLogin} class="flex flex-col gap-6 mb-5">
			<input
				type="text"
				name="email"
				placeholder="Please enter your email"
				class="bg-white p-3 text-gray-800"
				bind:value={email}
			/>
			<input
				type="password"
				name="password"
				placeholder="Enter password"
				class="bg-white p-3 text-gray-800"
				bind:value={password}
			/>
			<button type="submit" class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors">
				Login
			</button>
		</form>
		<a href="/login/reset" class="text-[#F2C94C] underline">Forgot password?</a>

		<div class="mt-5 mb-11">
			<p>Or login using</p>
			<div class="flex gap-2.5 mb-5">
				<button on:click={googleLogin} class=""><img src="https://placehold.co/40" alt="Login with Google" /></button>
				<button on:click={facebookLogin} class=""><img src="https://placehold.co/40" alt="Login with Facebook" /></button>
			</div>

			Not registered? <a href="/register" class="text-brand underline">Create an account</a>
		</div>
	</div>
</div>

<style lang="postcss">
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-image: url('https://www.pbs.org/wnet/nature/files/2021/01/pexels-denis-linine-714258.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>
