<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { cart, getTotalPrice } from '$lib/stores/cart';
	import type { PageProps } from './$types';
	let email = $state('');
	let fullName = $state('');
	let address = $state('');
	let city = $state('');
	let province = $state('');
	let zip = $state('');
	let phone = $state('');

	let errors = {};
	let touched = {};

	let disabled = $state(false);

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Checkout | One10 Studio Labs</title>
</svelte:head>

<form
	method="POST"
	action="?/create"
	use:enhance={async () => {
		disabled = true;
		return async ({ result }) => {
			disabled = false;
			if (result.type === 'success') {
				cart.set([]);
				window.location.href = result.data?.redirectUrl as string;
			}
		};
	}}
	class="flex py-10 justify-evenly"
>
	<input type="hidden" name="cart" value={JSON.stringify($cart)} />
	<div class="flex flex-col">
		<div class="flex flex-col space-y-11">
			<h1 class="header-1">Checkout</h1>

			<h2 class="header-2 py-4">Shipping details</h2>
			<!-- Client asked to not have customer accounts yet -->
			<!-- <div class="flex flex-col py-10"> -->
			<!-- {#if !$user} -->
			<!-- <div class="container-1 flex items-center justify-start"> -->
			<!-- <p class="typography-1 mx-auto"> -->
			<!-- ALREADY HAVE AN ACCOUNT? <a href="/login" class="underline font-bold">LOGIN</a> FOR A FASTER -->
			<!-- CHECKOUT. -->
			<!-- </p> -->
			<!-- </div> -->
			<!-- {/if} -->
			<!-- </div> -->

			<div class="flex flex-col space-y-10">
				<!-- {#if !$user} -->
				<div>
					<label for="email" class="labels">Email address</label>
					<input
						type="email"
						bind:value={email}
						placeholder="Please enter your email"
						class="bg-white border-red-500 p-3 text-gray-800 w-full"
						class:border-2={form?.issues?.['email']}
						name="email"
						id="email"
					/>
					{#if form?.issues?.['email']}
						<p class="text-red-500 text-sm mt-1">{form.issues['email']}</p>
					{/if}
				</div>
				<!-- {/if} -->

				<!-- {#if !$user} -->
				<div>
					<label for="name" class="labels">Full name</label>
					<input
						id="name"
						name="fullName"
						type="text"
						bind:value={fullName}
						placeholder="Full name"
						class="bg-white p-3 text-gray-800 border-red-500 w-full"
						class:border-2={form?.issues?.['fullName']}
					/>
					{#if form?.issues?.['fullName']}
						<p class="text-red-500 text-sm mt-1">{form.issues['fullName']}</p>
					{/if}
				</div>
				<!-- {/if} -->

				<div>
					<label for="address" class="labels">Street Address and Barangay</label>
					<input
						type="text"
						id="address"
						name="address"
						bind:value={address}
						placeholder="Address"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['address']}
					/>
					{#if form?.issues?.['address']}
						<p class="text-red-500 text-sm mt-1">{form.issues['address']}</p>
					{/if}
				</div>

				<div>
					<label for="city" class="labels">City</label>
					<input
						type="text"
						name="city"
						bind:value={city}
						placeholder="City"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['city']}
					/>
					{#if form?.issues?.['city']}
						<p class="text-red-500 text-sm mt-1">{form.issues['city']}</p>
					{/if}
				</div>

				<div>
					<label for="province" class="labels">Province</label>
					<input
						type="text"
						name="province"
						bind:value={province}
						placeholder="Province"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['province']}
					/>
					{#if form?.issues?.['province']}
						<p class="text-red-500 text-sm mt-1">{form.issues['province']}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="zip" class="labels">ZIP Code</label>
					<input
						type="text"
						bind:value={zip}
						name="zip"
						id="zip"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['zip']}
					/>
					{#if form?.issues?.['zip']}
						<p class="text-red-500 text-sm mt-1">{form.issues['zip']}</p>
					{/if}
				</div>
				<div>
					<label for="phone" class="labels">Phone</label>
					<input
						type="text"
						bind:value={phone}
						name="phone"
						id="phone"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['phone']}
					/>
					{#if form?.issues?.['phone']}
						<p class="text-red-500 text-sm mt-1">{form.issues['phone']}</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="py-8">
			<button
				{disabled}
				class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors px-8"
				type="submit"
			>
				Confirm order
			</button>
		</div>
	</div>

	<div class="w-lg rounded-2xl h-min bg-[#d9d9d9]">
		<div class="flex flex-col py-8 px-5 space-y-3">
			<h1 class="font-spaceGrotesk font-bold py-3 uppercase">Order Summary</h1>

			{#each $cart as item}
				<div class="flex gap-4 items-center px-4 w-full">
					<img
						src={item.imageUrl}
						class="flex-1 max-w-[100px] h-auto object-contain self-start"
						alt={item.name}
					/>
					<div class="flex flex-col space-y-3 flex-[2]">
						<p class="font-openSans font-bold">{item.name}</p>
						<p class="Qty">QTY: {item.quantity}</p>
					</div>
					<p class="self-end flex-1 text-right">P{getTotalPrice(item).toLocaleString()}</p>
				</div>
			{/each}

			<!-- <div class="space-y-3">
				<div class="flex justify-between">
					<p class="breakdown">Items</p>
					<p class="breakdown">P{$cart.reduce((total, item) => total + getTotalPrice(item), 0)}</p>
				</div>

				<div class="flex justify-between">
					<p class="breakdown">Shipping</p>
					<p class="breakdown">P0.00</p>
				</div>
			</div> -->

			<div class="flex justify-between pt-15">
				<h1 class="total">Total</h1>
				<p class="total">
					P{$cart.reduce((total, item) => total + getTotalPrice(item), 0).toLocaleString()}
				</p>
			</div>
			<p class="italic">
				Price does not include any shipping costs. Shipping costs are paid by the customer.
			</p>
		</div>
	</div>
</form>

<style>
	.total {
		color: var(--Global-black, #000);
		font-family: 'Open Sans';
		font-size: 1.5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 0.9rem; /* 60% */
		text-transform: uppercase;
	}
	.header-1 {
		color: var(--Gray-1, #333);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: var(--Gray-1, #333);
		font-family: 'Space Grotesk';
		font-size: 5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 5.5rem;
		letter-spacing: -0.1rem;
	}

	.header-2 {
		color: var(--Global-black, #000);
		/* Headings/h2 */
		font-family: 'Space Grotesk';
		font-size: 2.375rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2.925rem; /* 123.158% */
	}

	.labels {
		color: var(--Global-black, #000);
		font-family: 'Open Sans';
		font-size: 0.875rem;
		font-style: normal;
		font-weight: 700;
		line-height: 0.9rem; /* 102.857% */
		text-transform: uppercase;
	}
</style>
