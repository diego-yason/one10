<script lang="ts">
	import { products, loading, error } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import { loadProducts } from '$lib/stores/products';
	import { user, isStaffUser } from '$lib/stores/auth';

	onMount(() => {
		loadProducts();
	});

	// Get the first 3 products for display
	$: homeProducts = $products.slice(0, 3);
</script>

<div class="min-h-[700px] h-[700px] max-h-[90vh] flex items-center justify-center">
	<div class="flex flex-col items-center justify-center text-center">
		<span class="text-4xl font-spaceGrotesk font-bold text-white">
			<img src="https://placehold.co/60x50" alt="" class="inline" />
			<span class="textOutline text-transparent">Studio</span> Lab
		</span>
		<h1 class="font-bold font-spaceGrotesk text-7xl text-white mt-4">We process your vision</h1>
	</div>
</div>
<div class="px-40 bg-gray-800 py-20">
	<div class="max-w-screen-xl w-full mx-auto">
		<div class="flex flex-row justify-around gap-40 mb-28">
			<div class="grow">
				<h2 class="text-amber-300 uppercase font-spaceGrotesk text-sm">--- Our Mission</h2>
				<p class="font-spaceGrotesk text-4xl text-white font-bold">
					Photography leads us to more interpretations of reality.
				</p>
			</div>
			<p class="font-roboto text-white basis-1/2">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam perspiciatis natus eaque,
				suscipit, repellendus quos ad minus perferendis laborum praesentium repellat necessitatibus ut
				accusantium consequuntur consequatur facere. Magni, voluptatem voluptatum?
			</p>
		</div>
		<div class="flex gap-24">
			<div>
				<img src="https://placehold.co/72" alt="" class="mb-8" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Develop + Scan</p>
				<p class="mt-5 mb-8">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia, ducimus. Sit animi
					fugiat fuga mollitia! Voluptates.
				</p>
				<a href="#" class="bg-amber-300 rounded-4xl px-6 py-2">Send us your film!</a>
			</div>
			<div>
				<img src="https://placehold.co/72" alt="" class="mb-8" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Printing</p>
				<p class="mt-5 mb-8">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore est exercitationem velit
					earum?
				</p>
				<a href="#" class="bg-amber-300 rounded-4xl px-6 py-2">Print your work</a>
			</div>
			<div>
				<img src="https://placehold.co/72" alt="" class="mb-8" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Studio Rental</p>
				<p class="mt-5 mb-8">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam, at! Officiis unde
					reprehenderit blanditiis optio.
				</p>
				<p class="text-amber-300">Coming soon</p>
			</div>
		</div>
	</div>
</div>
<div class="py-24 bg-transparent">
	<h2 class="text-center font-spaceGrotesk text-4xl font-bold mb-20">Need some fresh rolls?</h2>
	<div class="max-w-6xl mx-auto w-full">
		{#if $loading}
			<div class="flex justify-center items-center py-20">
				<p class="text-lg">Loading products...</p>
			</div>
		{:else if $error}
			<div class="flex justify-center items-center py-20">
				<p class="text-lg text-red-600">Error loading products: {$error}</p>
			</div>
		{:else if homeProducts.length === 0}
			<div class="flex gap-7 justify-center mb-16">
				<div class="overflow-hidden rounded-2xl bg-gray-400">
					<img src="https://placehold.co/333x214" alt="" />
					<div class="mb-10 mx-8 text-center pt-10">
						<p class="uppercase text-xs font-spaceGrotesk mb-3.5">Films</p>
						<p class="font-spaceGrotesk text-xl font-bold mb-3.5">No products available</p>
						<button class="px-6 py-2 outline-2 outline-black rounded-4xl" disabled>Add to cart</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex gap-8 justify-center mb-10">
				{#each homeProducts as product}
					<div class="overflow-hidden rounded-2xl bg-gray-400 relative w-[340px] max-w-full flex flex-col">
						<a href={`/product/${product.id}`}>
							{#if product.imageUrl}
								<img src={product.imageUrl} alt={product.name} class="w-full h-48 object-cover" />
							{:else}
								<img src="https://placehold.co/333x214" alt="" class="w-full h-48 object-cover" />
							{/if}
						</a>
						{#if product.status !== 'available'}
							<span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10">Sold Out</span>
						{/if}
						<div class="mb-8 mx-6 text-center pt-8">
							<p class="uppercase text-xs font-spaceGrotesk mb-2">{product.category}</p>
							<p class="font-spaceGrotesk text-xl font-bold mb-2">
								<a href={`/product/${product.id}`} class="transition-colors hover:text-[#F2C94C]">{product.name}</a>
							</p>
							<p class="text-sm text-gray-600 mb-2">{product.description}</p>
							<p class="font-semibold text-lg mb-2">₱{product.price}</p>
							{#if !$user || !isStaffUser($user)}
								<button class="px-6 py-2 outline-2 outline-black rounded-4xl hover:bg-black hover:text-white transition-colors" disabled={product.status !== 'available'}>{product.status !== 'available' ? 'Out of Stock' : 'Add to cart'}</button>
							{:else}
								<span class="px-6 py-2 outline-2 outline-black rounded-4xl bg-gray-100 text-gray-400 cursor-not-allowed">Staff view</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<a href="/services" class="bg-amber-300 px-6 py-2 rounded-4xl block w-min whitespace-nowrap mx-auto mt-4">
			View all
		</a>
	</div>
</div>
<div class="text-center py-24 bg-gray-300">
	<h2 class="font-spaceGrotesk font-bold text-4xl mb-6">Got some questions?</h2>
	<a href="#" class="border-2 border-white rounded-4xl px-6 py-2">Read our FAQs</a>
</div>
{#if !$user}
<div class="py-32 px-40 flex flex-row items-center justify-between">
	<div class="flex flex-col justify-center" style="min-width: 480px;">
		<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-2">
			<span class="block textOutline text-transparent">Sign up</span> and save
		</h2>
		<p class="text-white font-roboto text-lg">Register and Subscribe to get special offers</p>
	</div>
	<div class="flex items-center">
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-8 py-3 text-base">Register / Log in</a>
	</div>
</div>
{/if}
