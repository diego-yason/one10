<script lang="ts">
	import { products, loading, error } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import { loadProducts } from '$lib/stores/products';

	onMount(() => {
		loadProducts();
	});

	// Get available products for display
	$: availableProducts = $products.filter(product => product.status === 'available').slice(0, 3);
</script>

<div class="h-screen flex flex-col items-center justify-center">
	<span class="text-4xl font-spaceGrotesk font-bold text-white">
		<img src="https://placehold.co/60x50" alt="" class="inline" />
		<span class="textOutline text-transparent">Studio</span> Lab
	</span>
	<h1 class="font-bold font-spaceGrotesk text-7xl text-white">We process your vision</h1>
</div>
<div class="px-40 bg-gray-800 py-20">
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
<div class="py-24">
	<h2 class="text-center font-spaceGrotesk text-4xl font-bold mb-20">Need some fresh rolls?</h2>
	
	{#if $loading}
		<div class="flex justify-center items-center py-20">
			<p class="text-lg">Loading products...</p>
		</div>
	{:else if $error}
		<div class="flex justify-center items-center py-20">
			<p class="text-lg text-red-600">Error loading products: {$error}</p>
		</div>
	{:else if availableProducts.length === 0}
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
		<div class="flex gap-7 justify-center mb-16">
			{#each availableProducts as product}
				<div class="overflow-hidden rounded-2xl bg-gray-400">
					{#if product.imageUrl}
						<img src={product.imageUrl} alt={product.name} class="w-full h-48 object-cover" />
					{:else}
						<img src="https://placehold.co/333x214" alt="" />
					{/if}
					<div class="mb-10 mx-8 text-center pt-10">
						<p class="uppercase text-xs font-spaceGrotesk mb-3.5">{product.category}</p>
						<p class="font-spaceGrotesk text-xl font-bold mb-3.5">{product.name}</p>
						<p class="text-sm text-gray-600 mb-3.5">{product.description}</p>
						<p class="font-semibold text-lg mb-3.5">₱{product.price}</p>
						<button class="px-6 py-2 outline-2 outline-black rounded-4xl hover:bg-black hover:text-white transition-colors">Add to cart</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	
	<a href="#" class="bg-amber-300 px-6 py-2 rounded-4xl block w-min whitespace-nowrap mx-auto">
		View all
	</a>
</div>
<div class="text-center py-24 bg-gray-300">
	<h2 class="font-spaceGrotesk font-bold text-4xl mb-6">Got some questions?</h2>
	<a href="#" class="border-2 border-white rounded-4xl px-6 py-2">Read our FAQs</a>
</div>
<!-- TODO: add signed in detection -->
<div class="py-48 flex justify-between px-40">
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
