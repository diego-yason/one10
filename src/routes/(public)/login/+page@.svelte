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

	const schema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters long')
	});

	let email = '';
	let password = '';
	let error = '';

	const handleEmailLogin = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		
		try {
			const result = schema.safeParse({ email, password });
			if (!result.success) {
				error = result.error.errors?.[0]?.message || 'Invalid input';
				return;
			}
			
			await signInWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during login';
		}
	};

	const googleLogin = async () => {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during Google login';
		}
	};

	const facebookLogin = async () => {
		try {
			await signInWithPopup(auth, new FacebookAuthProvider());
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during Facebook login';
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

		<div style="min-height: 56px; margin-bottom: 20px;">
			{#if error}
				<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
					{error}
				</div>
			{/if}
		</div>

		<form on:submit={handleEmailLogin} class="flex flex-col gap-6 mb-5">
			<input
				type="email"
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
