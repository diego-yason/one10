<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { z } from 'zod/v4';

	const schema = z.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters long')
	});

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let error = '';

	const handleRegister = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		
		try {
			const result = schema.safeParse({ firstName, lastName, email, password });
			if (!result.success) {
				error = result.error.errors?.map(e => e.message).join(', ') || 'Invalid input';
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during registration';
		}
	};

	const handleGoogleSignIn = async () => {
		error = '';
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during Google sign-in';
		}
	};

	const handleFacebookSignIn = async () => {
		error = '';
		try {
			const provider = new FacebookAuthProvider();
			await signInWithPopup(auth, provider);
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during Facebook sign-in';
		}
	};
</script>

<div class="register-container">
	<div class="mx-auto w-96 text-gray-100 mt-5">
		<span class="text-4xl font-spaceGrotesk font-bold">
			<img src="https://placehold.co/60x50" alt="" class="inline" />
			<span class="textOutline text-transparent">Studio</span> Lab
		</span>

		<div class="mb-7 mt-8">
			<h1 class="font-spaceGrotesk text-3xl font-bold">Create your account</h1>
		</div>

		<div style="min-height: 56px; margin-bottom: 20px;">
			{#if error}
				<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
					{error}
				</div>
			{/if}
		</div>

		<form on:submit={handleRegister} class="flex flex-col gap-6 mb-5">
			<input
				type="text"
				name="firstName"
				placeholder="First name"
				class="bg-white p-3 text-gray-800"
				bind:value={firstName}
				required
			/>
			<input
				type="text"
				name="lastName"
				placeholder="Last name"
				class="bg-white p-3 text-gray-800"
				bind:value={lastName}
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Please enter your email"
				class="bg-white p-3 text-gray-800"
				bind:value={email}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Enter password"
				class="bg-white p-3 text-gray-800"
				bind:value={password}
				required
			/>
			<button type="submit" class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors">
				Sign up
			</button>
		</form>

		<div class="mt-5 mb-11">
			<p>Or create an account using</p>
			<div class="flex gap-2.5 mb-5">
				<button type="button" on:click={handleGoogleSignIn}><img src="https://placehold.co/40" alt="Sign up with Google" /></button>
				<button type="button" on:click={handleFacebookSignIn}><img src="https://placehold.co/40" alt="Sign up with Facebook" /></button>
			</div>

			Already have an account?
			<a href="/login" class="text-brand underline">Log in</a>
		</div>
	</div>
</div>

<style lang="postcss">
	.register-container {
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
