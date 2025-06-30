<script lang="ts">
	import { auth } from '$lib/firebase';
	import {
		FacebookAuthProvider,
		GoogleAuthProvider,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { loginSchema, getFirebaseErrorMessage, validateField } from '$lib/validation';

	let email = '';
	let password = '';
	let errorMessages: string[] = [];
	let fieldErrors: Record<string, string> = {};

	// Real-time validation function
	function handleFieldChange(field: string, value: string) {
		// Clear general errors when user starts typing
		if (errorMessages.length > 0) {
			errorMessages = [];
		}
		
		// Validate the specific field
		const error = validateField(loginSchema, field as keyof typeof loginSchema.shape, value);
		if (error) {
			fieldErrors = { ...fieldErrors, [field]: error };
		} else {
			const { [field]: _, ...rest } = fieldErrors;
			fieldErrors = rest;
		}
	}

	const handleEmailLogin = async (e: SubmitEvent) => {
		e.preventDefault();
		errorMessages = [];
		fieldErrors = {};

		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			if (result.error && Array.isArray(result.error.errors)) {
				// Group errors by field
				result.error.errors.forEach(error => {
					const field = error.path[0] as string;
					fieldErrors[field] = error.message;
				});
			} else {
				errorMessages = ['Invalid input.'];
			}
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/dashboard');
			} else {
				goto('/');
			}
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const googleLogin = async () => {
		errorMessages = [];
		fieldErrors = {};
		try {
			const result = await signInWithPopup(auth, new GoogleAuthProvider());
			const user = result.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/dashboard');
			} else {
				goto('/');
			}
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const facebookLogin = async () => {
		errorMessages = [];
		fieldErrors = {};
		try {
			const result = await signInWithPopup(auth, new FacebookAuthProvider());
			const user = result.user;
			if (user.email && user.email.endsWith('@one10.com')) {
				goto('/dashboard');
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
			<div>
				<input
					type="email"
					name="email"
					placeholder="Please enter your email"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.email ? 'border-2 border-red-500' : ''}"
					bind:value={email}
					on:input={(e) => handleFieldChange('email', e.currentTarget.value)}
				/>
				{#if fieldErrors.email}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
				{/if}
			</div>
			
			<div>
				<input
					type="password"
					name="password"
					placeholder="Enter password"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.password ? 'border-2 border-red-500' : ''}"
					bind:value={password}
					on:input={(e) => handleFieldChange('password', e.currentTarget.value)}
				/>
				{#if fieldErrors.password}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
				{/if}
			</div>
			
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
