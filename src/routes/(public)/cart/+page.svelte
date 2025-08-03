<script lang="ts">
	import { dev } from '$app/environment';
	import { user } from '$lib/stores/auth';
	import {
		cart,
		clear,
		remove,
		updateQuantity,
		add,
		verifyCart,
		showToast
	} from '$lib/stores/cart';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import background1 from '$lib/imgs/backgrounds/img086.jpg';

	let total = $state(0);

	verifyCart();
	setInterval(verifyCart, 1000 * 60 * 5); // Verify cart every 5 minutes while in page

	cart.subscribe((cart) => {
		total = cart.reduce(
			(sum, item) =>
				sum +
				(item.price + (item.addons?.reduce((acc, addon) => acc + addon.price, 0) ?? 0)) *
					item.quantity,
			0
		);
	});

	onMount(() => {
		if (page.url.searchParams.has('invalid-cart'))
			showToast(
				'Your cart has been updated. Please review your cart before proceeding to checkout.'
			);
	});

	function removeItem(index: number) {
		remove(index);
	}

	import CartItem from './CartItem.svelte';

	let hideDev = $state(false);
</script>

<svelte:head>
	<title>Cart | One10 Studio Labs</title>
</svelte:head>

<!-- {#if dev && !hideDev}
	<button class="bg-red-400 py-1.5 ml-2" onclick={() => (hideDev = true)}>
		hide (refresh to return)
	</button>
	<button
		onclick={() =>
			add({
				name: 'New 16mm Film',
				quantity: 1,
				price: 450,
				id: 'new-film-1',
				details: {
					filmType: '35mm',
					filmBrand: 'Kodak Gold 400'
				},
				imageUrl: 'https://placehold.co/100x60',
				notes: ''
			})}
		class="bg-green-500 text-white px-4 py-2 rounded"
	>
		Add Item
	</button>

	<button onclick={() => clear()} class="bg-green-500 text-white px-4 py-2 rounded">
		Clear Storage
	</button>
{/if} -->

<h2 class="text-gray-800 px-32 font-spaceGrotesk text-7xl font-bold text-left w-3/4 h-30">Cart</h2>
<div class="flex flex-col px-32 pb-24 space-y-6">

	{#if $cart.length === 0}
		<div class="flex flex-col bg-gray-200 rounded-lg items-center justify-center py-20">
			<p class="text-lg mb-4 font-bold">Your cart is empty.</p>
			<a
				href="/store"
				class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black hover:bg-amber-400 transition"
			>
				Go to Products
			</a>
		</div>
	{:else}
		{#each $cart as item, i (item.id + '-' + i)}
			{#key item.quantity}
				<CartItem {...item} {updateQuantity} {removeItem} {i}></CartItem>
			{/key}
		{/each}
		<div class="border-1 rounded-lg my-auto p-3 font-bold">
			<h2 class="text-4xl font-bold mb-6">Order Summary</h2>
			<div class="flex justify-between items-center">
				<div>
					<h3 class="flex space-x-4 items-center">
						<span class="font-normal text-2xl">Total</span>
						<span class="bg-amber-400 px-3 py-2 rounded-xl text-xl">P{total}</span>
					</h3>
				</div>
				<div class="flex gap-4">
					<button
						class="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
						onclick={clear}>Clear Cart</button
					>
					<a
						href="/checkout"
						class="bg-yellow-600 flex items-center text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
					>
						Checkout
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<section class="w-full mt-16 flex flex-col md:flex-row">
	<div
		class="bg-amber-300 flex-1 flex flex-col justify-center items-start py-16 px-10"
		style="padding-left: 8rem;"
	>
		<h2 class="text-4xl font-bold mb-8">Reminders</h2>
		<div>
			<h3 class="text-2xl font-bold mb-4">We only accept</h3>
			<ul class="text-lg text-gray-700 font-medium space-y-2">
				<li>135mm/35 mm Disposables</li>
				<li>120 format/ Medium format</li>
				<li>C-41/C16 Process</li>
				<li>Black and White Process</li>
				<li>Push Processing</li>
			</ul>
		</div>
	</div>
	<div
		class="flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-cover bg-center"
		style="background-image: url({background1});"
	>
		<h2 class="text-3xl font-bold mb-6 text-black">Got some questions?</h2>
		<a href="/faq" class="bg-amber-300 rounded-4xl px-8 py-3 font-bold text-black text-lg"
			>Read our FAQs</a
		>
	</div>
</section>

<!-- {#if $user === null}
	<div class="py-48 flex justify-between px-40 background-color">
		<div>
			<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
				<span class="block textOutline text-transparent">Sign up</span> and save
			</h2>
			<p class="text-white font-roboto">Register and Subscribe to get special offers</p>
		</div>
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center"
			>Register / Log in</a
		>
	</div>
{/if} -->

<style>
	/* .background-color {
		background: var(--Gray-2, #4f4f4f);
	} */
</style>
