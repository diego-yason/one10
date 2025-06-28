<script lang="ts">
	import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { registerSchema, getFirebaseErrorMessage, validateField } from '$lib/validation';

	let firstName = '';
	let lastName = '';
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
		const error = validateField(registerSchema, field as keyof typeof registerSchema.shape, value);
		if (error) {
			fieldErrors = { ...fieldErrors, [field]: error };
		} else {
			const { [field]: _, ...rest } = fieldErrors;
			fieldErrors = rest;
		}
	}

	const handleRegister = async (e: SubmitEvent) => {
		e.preventDefault();
		errorMessages = [];
		fieldErrors = {};

		const result = registerSchema.safeParse({ firstName, lastName, email, password });
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
			await createUserWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const handleGoogleSignIn = async () => {
		errorMessages = [];
		fieldErrors = {};
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			goto('/');
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const handleFacebookSignIn = async () => {
		errorMessages = [];
		fieldErrors = {};
		try {
			const provider = new FacebookAuthProvider();
			await signInWithPopup(auth, provider);
			goto('/');
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
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

		{#if errorMessages.length}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
				<ul>
					{#each errorMessages as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form on:submit={handleRegister} class="flex flex-col gap-6 mb-5">
			<div>
				<input
					type="text"
					name="firstName"
					placeholder="First name"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.firstName ? 'border-2 border-red-500' : ''}"
					bind:value={firstName}
					on:input={(e) => handleFieldChange('firstName', e.currentTarget.value)}
				/>
				{#if fieldErrors.firstName}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
				{/if}
			</div>
			
			<div>
				<input
					type="text"
					name="lastName"
					placeholder="Last name"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.lastName ? 'border-2 border-red-500' : ''}"
					bind:value={lastName}
					on:input={(e) => handleFieldChange('lastName', e.currentTarget.value)}
				/>
				{#if fieldErrors.lastName}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
				{/if}
			</div>
			
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
