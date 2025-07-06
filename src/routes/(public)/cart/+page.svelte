<script>
	import CartItem from './CartItem.svelte';
	import { onMount } from 'svelte';
	import { user, isStaffUser, authLoaded } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let cartItems = [];
	let loaded = false;
	let authChecked = false;
	let currentUser = null;
	let isAuthLoaded = false;

	// Improved client-side route protection with loading state
	onMount(() => {
		const unsubUser = user.subscribe(($user) => {
			currentUser = $user;
		});
		const unsubLoaded = authLoaded.subscribe(($authLoaded) => {
			isAuthLoaded = $authLoaded;
			if (isAuthLoaded) {
				if (currentUser && isStaffUser(currentUser)) {
					goto('/');
				} else if (currentUser === null) {
					goto('/login');
				}
			}
		});
		return () => {
			unsubUser();
			unsubLoaded();
		};
	});

	onMount(() => {
		const stored = localStorage.getItem('cart');
		if (stored) {
			cartItems = JSON.parse(stored);
		} else {
			cartItems = [
				{ type: "test", name: "film format 1234mm", quantity: 3, price: 300 },
				{ type: "camera", name: "35mm SLR Camera", quantity: 1, price: 2000 }
			];
		}
		loaded = true;
	});

	$: if (loaded) {
		localStorage.setItem('cart', JSON.stringify(cartItems));
	}

function addItem(newItem) {
	cartItems = [...cartItems, newItem];
}

function clearStorage() {
	localStorage.clear();
	cartItems = [];
}
</script>

<!--Testing Buttons
<button
	on:click={() =>
		addItem({ type: "film", name: "New 16mm Film", quantity: 1, price: 450 })

	}
	class="bg-green-500 text-white px-4 py-2 rounded"
>
	Add Item
</button>

<button
	on:click={() =>
		clearStorage()
	}
	class="bg-green-500 text-white px-4 py-2 rounded"
>
	Clear Storage
</button>
-->

<div class="flex flex-col px-32 py-24 space-y-6">
	<!--Item container-->
	<h2
		class="text-gray-800 font-spaceGrotesk text-7xl font-bold text-left w-3/4 mb-auto h-30 mt-10"
	>
		Cart
	</h2>
	{#each cartItems as item (item.name)}
		<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 ">
			<div class="flex">
				<CartItem {item} />
			</div>
		</div>
	{/each}
	<!--Order Summary-->
	<div class="flex border-1 rounded-lg  my-auto y-100 p-5 text-left font-bold py-15">
		<div>
			<h2>Order Summary</h2>
			<div class="flex space-x-4">
				<h3>Total</h3>
				<h3 class="font-normal">P500</h3>
			</div>
		</div>
		<div class="ml-auto">
			<button
				class="bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
				>Checkout</button
			>
		</div>
	</div>
</div>

<div class="flex">
	<div class="reminders flex items-center">
		<div class="flex flex-col flex-start space-y-18 mx-35">
			<h3 class="heading-3">Reminders</h3>
		
			<div class="flex flex-col justify-center space-y-2">
				<h5 class="heading-5">We only accept</h5>
				
				<p class="desc">135mm/35 mm Disposables
					120 format/ Medium format
					C-41/C16 Process
					Black and White Process
					Push Processing</p>
			</div>
		</div>
	</div>
	<div class="image flex items-center justify-center bg-white">Placeholder</div>
</div>

<div class="py-48 flex justify-between px-40 background-color">
	<div>
		<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
			<span class="block textOutline text-transparent">Sign up</span> and save
		</h2>
		<p class="text-white font-roboto">Register and Subscribe to get special offers</p>
	</div>
	<a href="#" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center"
		>Register / Log in</a
	>
</div>



<style>
	.reminders{
		width: 90rem;
		height: 26.6875rem;
		flex-shrink: 0;
		background: #F2C94C;
	}

	.image{
		width: 29rem;
		height: 26.6875rem;
		flex-shrink: 0;
	}

	.heading-3{
		color: var(--Global-black, #000);
		/* Headings/h3 */
		font-family: "Space Grotesk";
		font-size: 1.875rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2.26rem; /* 120.533% */
	}

	.heading-5{
		width: 12.8125rem;
		height: 2.1875rem;
		flex-shrink: 0;

		color: var(--Global-black, #000);

		/* headings/h5 */
		font-family: "Space Grotesk";
		font-size: 1.375rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2rem; /* 145.455% */
		letter-spacing: 0.075rem;
	}

	.desc{
		width: 15.25rem;
		height: 10.75rem;
		flex-shrink: 0;
		color: var(--Gray-2, #4F4F4F);

		/* Paragraphs/p-normal */
		font-family: Roboto;
		font-size: 0.9375rem;
		font-style: normal;
		font-weight: 500;
		line-height: 1.3875rem; /* 148% */
		letter-spacing: 0.0375rem;
	}

	.background-color{
           background: var(--Gray-2, #4F4F4F);
    }
</style>