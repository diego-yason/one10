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

	// TODO: implement form validation
	const schema = z.object({
		email: z.email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters long')
	});

	let email = '';
	let password = '';
	const emailLogin = () => signInWithEmailAndPassword(auth, email, password).then(() => goto('/'));

	const googleLogin = () => signInWithPopup(auth, new GoogleAuthProvider()).then(() => goto('/'));
	const facebookLogin = () =>
		signInWithPopup(auth, new FacebookAuthProvider()).then(() => goto('/'));
</script>

<!-- <div class="text-white"> -->
<!-- Use the div with class once there is an image -->
<div class="mx-auto w-96 text-gray-100">
	<!-- TODO: add 110 logo -->
	<!-- TODO: add "Studio" outline -->
	<span class="text-4xl font-spaceGrotesk font-bold">
		<img src="https://placehold.co/60x50" alt="" class="inline" />
		<span class="textOutline text-transparent">Studio</span> Lab
	</span>

	<div class="mb-7 mt-20">
		<p class="text-xs">Welcome back</p>
		<h1 class="font-spaceGrotesk text-3xl font-bold">Login to your account</h1>
	</div>
	<form action="" class="flex flex-col gap-6 mb-5" onsubmit={emailLogin}>
		<input
			type="email"
			name=""
			id=""
			placeholder="Please enter your email"
			class="bg-white p-3 text-gray-800"
			bind:value={email}
		/>
		<input
			type="password"
			name=""
			id=""
			placeholder="Enter password"
			class="bg-white p-3 text-gray-800"
			bind:value={password}
		/>
		<button class="bg-amber-600 text-white py-2">Login</button>
	</form>
	<a href="#" class="text-[#F2C94C] underline">Forgot password?</a>

	<div class="mt-16 mb-11">
		<p>Or login using</p>
		<div class="flex gap-2.5">
			<button onclick={googleLogin} class=""><img src="https://placehold.co/40" alt="" /></button>
			<button onclick={facebookLogin} class=""><img src="https://placehold.co/40" alt="" /></button>
		</div>
	</div>

	<p>Not registered? <a href="/register" class="text-brand underline">Create an account</a></p>
</div>

<style lang="postcss">
	:global(body) {
		background-image: url('https://www.pbs.org/wnet/nature/files/2021/01/pexels-denis-linine-714258.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
