<script lang="ts">
	import { page } from '$app/state';
	import { user, isStaffUser } from '$lib/stores/auth';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/services/firebase';
	import { goto } from '$app/navigation';
	let { children } = $props();

	const handleSignOut = async () => {
		await signOut(auth);
		goto('/');
	};
</script>

<div class="min-h-screen flex flex-col">
	<nav class="flex justify-between py-10 px-32 font-poppins text-white w-full">
		<div class="flex flex-row gap-20 items-center">
			<a href="/">
				<img src="https://placehold.co/100x60" alt="" />
			</a>
			<a href="/" class:font-semibold={page.url.pathname === '/'}>Home</a>
			<a href="/services" class:font-semibold={page.url.pathname === '/services'}>Services</a>
			<a href="#">Track</a>
			<a href="/faq">FAQs</a>
		</div>
		<div class="flex flex-row gap-14 items-center">
			{#if $user}
				{#if isStaffUser($user)}
					<a href="/dashboard">Staff</a>
					<button onclick={handleSignOut} class="hover:text-amber-300 transition-colors"
						>Sign Out</button
					>
				{:else}
					<a href="/cart">Cart</a>
					<button onclick={handleSignOut} class="hover:text-amber-300 transition-colors"
						>Sign Out</button
					>
				{/if}
			{:else}
				<a href="/cart">Cart</a>
				<a href="/login">Log In</a>
			{/if}
		</div>
	</nav>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer
		class="bg-[#333] font-roboto text-[#7A7A7A] flex flex-row justify-between pt-12 pb-20 px-44"
	>
		<p>One 10 Studio Lab | Muntinlupa City, Metro Manila</p>
		<p>
			Copyright © 2025, <span class="text-amber-300">One 10 Studio Lab</span> | All rights reserved.
		</p>
	</footer>
</div>
