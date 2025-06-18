<script lang="ts">
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { createOrUpdateUser } from '$lib/stores/auth';
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
				error = result.error.errors[0].message;
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			await createOrUpdateUser(userCredential.user, {
				firstName,
				lastName,
				email
			});
			goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during registration';
		}
	};
</script>

<div class="register-container">
	<div class="mx-auto w-96 text-gray-100">
		<span class="text-4xl font-spaceGrotesk font-bold">
			<img src="https://placehold.co/60x50" alt="" class="inline" />
			<span class="textOutline text-transparent">Studio</span> Lab
		</span>

		<div class="mb-7 mt-8">
			<h1 class="font-spaceGrotesk text-3xl font-bold">Create your account</h1>
		</div>

		{#if error}
			<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
				{error}
			</div>
		{/if}

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

		<div class="mt-16 mb-11">
			<p>Or create an account using</p>
			<div class="flex gap-2.5">
				<button class=""><img src="https://placehold.co/40" alt="Sign up with Google" /></button>
				<button class=""><img src="https://placehold.co/40" alt="Sign up with Facebook" /></button>
			</div>
		</div>
		<p>
			Already have an account?
			<a href="/login" class="text-brand underline">Log in</a>
		</p>
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
