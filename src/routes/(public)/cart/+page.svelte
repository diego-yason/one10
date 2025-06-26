<script>
	import CartItem from './CartItem.svelte';
	import { onMount } from 'svelte';

	let cartItems = [];
	let loaded = false;

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

<div class="flex-col items-center justify-center text-center space-y-6 m-10">
	<!--Item container-->
	<h2
		class="text-gray-800 font-spaceGrotesk text-7xl font-bold text-left mx-auto w-3/4 mb-auto h-30"
	>
		Cart
	</h2>
	{#each cartItems as item (item.name)}
		<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 mx-auto w-3/4">
			<div class="flex">
				<CartItem {item} />
			</div>
		</div>
	{/each}
	<!--Order Summary-->
	<div class="flex border-1 rounded-lg mx-auto w-3/4 my-auto y-100 p-5 text-left font-bold">
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
