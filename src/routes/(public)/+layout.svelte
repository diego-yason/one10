<script module lang="ts">
	import { writable } from 'svelte/store';
	export let navHeight = writable(0);
	navHeight.subscribe((h) => console.log('Nav Height:', h));
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { user } from '$lib/stores/auth';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/services/firebase';
	import { goto } from '$app/navigation';
	let { children } = $props();

	const handleSignOut = async () => {
		await signOut(auth);
		goto('/');
	};

	import logo from '$lib/imgs/logo/white.png';
</script>

<div class="min-h-screen flex flex-col">
	<nav
		class="flex justify-between py-10 z-10 px-32 font-poppins text-white w-full"
		bind:clientHeight={$navHeight}
	>
		<div class="flex flex-row gap-20 items-center">
			<a href="/">
				<img src={logo} class="w-[100px] h-[50px] object-contain" alt="logo" />
			</a>
			<a href="/" class:font-semibold={page.url.pathname === '/'}>Home</a>
			<a href="/store" class:font-semibold={page.url.pathname.startsWith('/store')}>Store</a>
			<a href="/track" class:font-semibold={page.url.pathname === '/track'}>Track</a>
			<a href="/faq" class:font-semibold={page.url.pathname === '/faq'}>FAQs</a>
		</div>
		<div class="flex flex-row gap-14 items-center">
			{#if $user}
				<a href="/dashboard" class:font-semibold={page.url.pathname.startsWith('/dashboard')}
					>Staff</a
				>
				<button onclick={handleSignOut} class="hover:text-amber-300 transition-colors"
					>Sign Out</button
				>
			{:else}
				<a href="/cart" class:font-semibold={page.url.pathname === '/cart'}>Cart</a>
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
