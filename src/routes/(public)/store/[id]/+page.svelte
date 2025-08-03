<script lang="ts">
	import { add, showToast } from '$lib/stores/cart';
	import type { FirebaseProduct } from '$types/firebase/Products';

	let { data } = $props();
	let { productId, product }: { productId: string; product: FirebaseProduct } = $derived(data);

	let quantity = $state(1);

	function addToCart() {
		if (!product) return;
		add({
			id: product.itemCode,
			name: product.name,
			price: product.price,
			quantity,
			// TODO: blank data
			details: {},
			imageUrl: product.imageUrl
		});
		showToast('Added to cart!');
	}
</script>

<svelte:head>
	<title>{product.name} | Products | One10 Studio Labs</title>
</svelte:head>

<div
	class="flex flex-col md:flex-row items-center justify-center min-h-[700px] py-4 px-4 bg-[#6b7283]"
>
	<div class="flex flex-col md:flex-row bg-transparent w-full max-w-3xl mx-auto rounded-2xl">
		<div
			class="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center md:mr-10 w-full max-w-xs"
		>
			<img
				src={product.imageUrl || 'https://placehold.co/400x300'}
				alt={product.name}
				class="w-72 h-72 object-cover rounded-lg mb-4"
			/>
		</div>
		<div class="mt-8 md:mt-0 flex flex-col items-start max-w-md w-full justify-center">
			<h1 class="text-3xl font-bold mb-4">{product.name}</h1>
			<p class="text-xl font-semibold mb-2">₱{product.price.toFixed(2)}</p>
			<p class="mb-4 text-gray-700">{product.description}</p>
			<p
				class="mb-4 text-base font-semibold"
				class:text-gray-700={product.stock > 0}
				class:text-red-600={product.stock === 0}
			>
				{product.stock}
				{product.stock > 0 ? 'in stock' : 'Out of stock'}
			</p>
			<div class="flex items-center gap-4 mt-4">
				<input
					type="number"
					min="1"
					max={product.stock}
					bind:value={quantity}
					class="w-16 px-2 py-1 rounded border border-gray-300"
				/>
				<button
					class="bg-amber-300 px-6 py-2 rounded-4xl font-bold text-black disabled:opacity-50"
					on:click={addToCart}
					disabled={product.stock === 0}>Add to cart</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.rounded-2xl {
		border-radius: 1rem;
	}
	.rounded-lg {
		border-radius: 0.5rem;
	}
	.bg-amber-300 {
		background-color: #f2c94c;
	}
</style>
