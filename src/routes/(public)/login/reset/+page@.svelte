<script lang="ts">
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '$lib/services/firebase';
	import { resetSchema, getFirebaseErrorMessage, validateField } from '$lib/validation';

	let email = '';
	let errorMessage: string = '';
	let successMessage: string = '';
	let fieldErrors: Record<string, string> = {};

	// Real-time validation function
	function handleFieldChange(field: string, value: string) {
		// Clear general errors when user starts typing
		if (errorMessage) {
			errorMessage = '';
		}
		if (successMessage) {
			successMessage = '';
		}

		// Validate the specific field
		const error = validateField(resetSchema, field as keyof typeof resetSchema.shape, value);
		if (error) {
			fieldErrors = { ...fieldErrors, [field]: error };
		} else {
			const { [field]: _, ...rest } = fieldErrors;
			fieldErrors = rest;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';
		fieldErrors = {};

		const result = resetSchema.safeParse({ email });
		if (!result.success) {
			if (result.error && Array.isArray(result.error.errors)) {
				// Group errors by field
				result.error.errors.forEach((error) => {
					const field = error.path[0] as string;
					fieldErrors[field] = error.message;
				});
			} else {
				errorMessage = 'Invalid input.';
			}
			return;
		}

		try {
			await sendPasswordResetEmail(auth, email);
			successMessage = `Password reset link sent to ${email}`;
		} catch (error) {
			errorMessage = getFirebaseErrorMessage(error);
		}
	}
</script>

<div class="forgot-password-container">
	<div class="mx-auto w-96 text-gray-100">
		<span class="text-4xl font-spaceGrotesk font-bold">
			<img src="https://placehold.co/60x50" alt="" class="inline" />
			<span class="logoOutline text-transparent">Studio</span> Lab
		</span>

		<div class="mt-10"></div>
		<h1 class="font-spaceGrotesk text-3xl font-bold mb-6">Forgot Password</h1>
		{#if errorMessage}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
				{errorMessage}
			</div>
		{/if}
		{#if successMessage}
			<div class="bg-green-500/10 border border-green-500 text-green-500 p-3 mb-5 rounded">
				{successMessage}
			</div>
		{/if}
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6 mb-5">
			<div>
				<input
					type="email"
					bind:value={email}
					on:input={(e) => handleFieldChange('email', e.currentTarget.value)}
					placeholder="Enter your email"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.email
						? 'border-2 border-red-500'
						: ''}"
				/>
				{#if fieldErrors.email}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
				{/if}
			</div>
			<button class="bg-amber-600 text-white py-2">Send Reset Link</button>
		</form>
		<a href="/" class="flex items-center gap-1 text-brand underline mt-4 mb-2"
			><span>&larr;</span> Back to Home</a
		>
		<a href="/login" class="text-brand underline">Back to Log in</a>
	</div>
</div>

<style lang="postcss">
	.forgot-password-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-image: url('https://www.pbs.org/wnet/nature/files/2021/01/pexels-denis-linine-714258.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.logoOutline {
		-webkit-text-stroke: 1px #fff;
	}
</style>
