<script lang="ts">
	import { auth } from '$lib/services/firebase';
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
	// function handleFieldChange(field: string, value: string) {
	// 	// Clear general errors when user starts typing
	// 	if (errorMessages.length > 0) {
	// 		errorMessages = [];
	// 	}

	// 	// Validate the specific field
	// 	const error = validateField(loginSchema, field as keyof typeof loginSchema.shape, value);
	// 	if (error) {
	// 		fieldErrors = { ...fieldErrors, [field]: error };
	// 	} else {
	// 		const { [field]: _, ...rest } = fieldErrors;
	// 		fieldErrors = rest;
	// 	}
	// }

	const handleEmailLogin = async (e: SubmitEvent) => {
		// e.preventDefault();
		// errorMessages = [];
		// fieldErrors = {};

		// const result = loginSchema.safeParse({ email, password });
		// if (!result.success) {
		// 	if (result.error && Array.isArray(result.error.errors)) {
		// 		// Group errors by field
		// 		result.error.errors.forEach((err: any) => {
		// 			const field = err.path[0] as string;
		// 			fieldErrors[field] = err.message;
		// 		});
		// 	} else {
		// 		errorMessages = ['Invalid input.'];
		// 	}
		// 	return;
		// }

		// try {
		// 	const userCredential = await signInWithEmailAndPassword(auth, email, password);
		// 	// Always redirect to homepage, regardless of user type
		// 	goto('/');
		// } catch (err) {
		// 	errorMessages = [getFirebaseErrorMessage(err)];
		// }

		errorMessages = [];
		fieldErrors = {};
		try {
			const result = await signInWithPopup(auth, new GoogleAuthProvider());
			// Always redirect to homepage, regardless of user type
			goto('/');
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	const googleLogin = async () => {
		errorMessages = [];
		fieldErrors = {};
		try {
			const result = await signInWithPopup(auth, new GoogleAuthProvider());
			// Always redirect to homepage, regardless of user type
			goto('/');
		} catch (err) {
			errorMessages = [getFirebaseErrorMessage(err)];
		}
	};

	// const facebookLogin = async () => {
	// 	errorMessages = [];
	// 	fieldErrors = {};
	// 	try {
	// 		const result = await signInWithPopup(auth, new FacebookAuthProvider());
	// 		// Always redirect to homepage, regardless of user type
	// 		goto('/');
	// 	} catch (err) {
	// 		errorMessages = [getFirebaseErrorMessage(err)];
	// 	}
	// };

	import background from '$lib/imgs/backgrounds/img24.jpg';
	import logo from '$lib/imgs/logo/white.png';
	// import Facebook from '$lib/imgs/logo/Facebook.png';
	import Google from '$lib/imgs/logo/Google.svg';
</script>

<svelte:head>
	<title>Login | One10 Studio Labs</title>
</svelte:head>

<div class="login-container relative">
	<div class="absolute inset-0 z-0 brightness-50">
		<img src={background} class="w-full h-full object-cover" alt="" />
	</div>
	<div class="mx-auto absolute z-10 w-96 text-gray-100">
		<span
			class="text-4xl font-spaceGrotesk font-bold flex items-baseline gap-2 leading-none text-white"
		>
			<img src={logo} class="w-[60px] inline object-contain" alt="logo" />
			<p><span class="textOutline text-transparent">Studio</span> Lab</p>
		</span>

		<div class="mb-7 mt-10">
			<p class="text-xs">Welcome back staff</p>
			<h1 class="font-spaceGrotesk text-3xl font-bold">Login to your account</h1>
		</div>

		<!-- {#if errorMessages.length}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
				<ul>
					{#each errorMessages as errMsg}
						<li>{errMsg}</li>
					{/each}
				</ul>
			</div>
		{/if} -->

		<form on:submit={handleEmailLogin} class="flex flex-col gap-6 mb-5">
			<!-- <div>
				<input
					type="email"
					name="email"
					placeholder="Please enter your email"
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.email
						? 'border-2 border-red-500'
						: ''}"
					bind:value={email}
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
					class="bg-white p-3 text-gray-800 w-full {fieldErrors.password
						? 'border-2 border-red-500'
						: ''}"
					bind:value={password}
				/>
				{#if fieldErrors.password}
					<p class="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
				{/if}
			</div> -->

			<button
				type="submit"
				class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
			>
				Sign In w/ Google
				<img src={Google} class="w-5 h-5" alt="Google logo" />
			</button>
		</form>
		<!-- <a href="/login/reset" class="text-[#F2C94C] underline">Forgot password?</a> -->
		<a href="/" class="flex items-center gap-1 text-brand underline mt-4 mb-2"
			><span>&larr;</span> Back to Home</a
		>

		<!-- <div class="mt-5 mb-11">
			<p class="mb-2">Or login using</p>
			<div class="flex gap-4 mb-5">
				<button on:click={googleLogin} class=""
					><img
						src={Google}
						class="w-[40px] object-contain aspect-square"
						alt="Login with Google"
					/></button
				>
				<button on:click={facebookLogin} class=""
					><img
						src={Facebook}
						class="w-[40px] object-contain aspect-square"
						alt="Login with Facebook"
					/></button
				>
			</div>

			<p>Not registered? <a href="/register" class="text-brand underline">Create an account</a></p>
		</div> -->
	</div>
</div>

<style lang="postcss">
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}
</style>
