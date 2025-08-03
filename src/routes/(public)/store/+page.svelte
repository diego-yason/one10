<script lang="ts">
	import { user } from '$lib/stores/auth';
	import background1 from '$lib/imgs/backgrounds/img039.jpg';
	import background2 from '$lib/imgs/backgrounds/img60.jpg';
	import background3 from '$lib/imgs/backgrounds/img61.jpg';

	let { data } = $props();
	let { products } = $derived(data);
	let searchTerm = $state('');
	let selectedCategory = $state('All');
	let sortBy = $state('name-asc');
	let categories = $derived(['All', ...new Set(products.map(p => p.category))]);

	const sortOptions = [
		{ value: 'name-asc', label: 'Name A-Z' },
		{ value: 'name-desc', label: 'Name Z-A' },
		{ value: 'price-high', label: 'Price High to Low' },
		{ value: 'price-low', label: 'Price Low to High' }
	];

	$effect(() => {
		console.log('Products loaded:', products.length);
		console.log('First product:', products[0]);
		console.log('Unique categories:', [...new Set(products.map(p => p.category))]);
		console.log('Current search term:', searchTerm);
		console.log('Selected category:', selectedCategory);
		console.log('Sort by:', sortBy);
	});

	let filteredProducts = $derived(products
		.filter((product) => {
			const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
			const searchMatch = searchTerm === '' || 
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(product.itemCode && product.itemCode.toLowerCase().includes(searchTerm.toLowerCase()));
			
			return categoryMatch && searchMatch;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'name-asc':
					return a.name.localeCompare(b.name);
				case 'name-desc':
					return b.name.localeCompare(a.name);
				case 'price-high':
					return b.price - a.price;
				case 'price-low':
					return a.price - b.price;
				default:
					return 0;
			}
		})
	);
</script>

<svelte:head>
	<title>Shop & Services | One10 Studio Labs</title>
</svelte:head>

<div class="py-10">
	<div class="flex flex-col ml-20 p-4 sm:p-8 md:p-12">
		<h1 class="text-[#333] font-spaceGrotesk text-7xl font-bold">Services</h1>
		<div class="flex flex-wrap w-full justify-start gap-12 py-4 px-4">
			<a
				href="/store/disposable"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img
					src={background1 || 'https://placehold.co/350x250'}
					alt="Disposable Camera"
					class="w-full h-36 object-cover"
				/>
				<div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
					<p class="font-bold underline text-base mb-1">Disposable Camera Service</p>
					<p class="text-sm">from P150</p>
				</div>
			</a>
			<a
				href="/store/35mm"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img src={background2 || 'https://placehold.co/350x250'} alt="35mm Film" class="w-full h-36 object-cover" />
				<div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
					<p class="font-bold underline text-base mb-1">35mm Services</p>
					<p class="text-sm">from P150</p>
				</div>
			</a>
			<a
				href="/store/120mm"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img src= {background3 || 'https://placehold.co/350x250'} alt="120mm Film" class="w-full h-36 object-cover" />
				<div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
					<p class="font-bold underline text-base mb-1">120 Film Services</p>
					<p class="text-sm">from P200</p>
				</div>
			</a>
			<!-- <a
				href="/store/printing"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img
					src="https://placehold.co/350x250"
					alt="3R - 8R Printing"
					class="w-full h-36 object-cover"
				/>
				<div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
					<p class="font-bold underline text-base mb-1">3R - 8R Printing</p>
					<p class="text-sm">from P8.00</p>
				</div>
			</a> -->
		</div>
	</div>
</div>

<div>
	<div class="flex flex-col px-32 py-8 mt-4">
		<h1 class="text-[#333] font-spaceGrotesk text-7xl font-bold">Shop</h1>

		<div class="flex flex-col sm:flex-row gap-4 my-6">
			<div class="flex-1">
				<input
					type="text"
					placeholder="Search products by name, category, or item code..."
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
					bind:value={searchTerm}
				/>
			</div>
			<div class="flex items-center gap-2">
				<label for="category-filter" class="text-sm font-semibold text-gray-700 whitespace-nowrap">
					Category:
				</label>
				<select
					id="category-filter"
					bind:value={selectedCategory}
					class="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent min-w-[200px]"
				>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center gap-2">
				<label for="sort-filter" class="text-sm font-semibold text-gray-700 whitespace-nowrap">
					Sort by:
				</label>
				<select
					id="sort-filter"
					bind:value={sortBy}
					class="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent min-w-[180px]"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="mb-4">
			<p class="text-sm text-gray-600">
				Showing {filteredProducts.length} of {products.length} products
				{#if searchTerm || selectedCategory !== 'All'}
					{#if searchTerm}
						for "{searchTerm}"
					{/if}
					{#if selectedCategory !== 'All'}
						in category "{selectedCategory}"
					{/if}
				{/if}
				{#if sortBy !== 'name-asc'}
					• Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
				{/if}
			</p>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 py-10">
			{#if filteredProducts.length === 0}
				<div class="col-span-full flex flex-col items-center justify-center py-20">
					<p class="text-lg text-gray-600 mb-2">No products found</p>
					{#if searchTerm || selectedCategory !== 'All'}
						<p class="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
					{/if}
				</div>
			{:else}
				{#each filteredProducts as product}
					<div
						class="px-2 py-2 items-center bg-[#fafafa] rounded-xl flex flex-col relative w-full"
					>
						<div class="image-2 flex items-center justify-center relative bg-[#FAFAFA] pt-3">
							<a href={`/store/${product.id}`}>
								{#if product.imageUrl}
									<img src={product.imageUrl} alt={product.name} class="product-img" />
								{:else}
									<span class="text-gray-400">No Image</span>
								{/if}
							</a>
							{#if product.status !== 'available'}
								<span
									class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10"
									>Sold Out</span
								>
							{/if}
						</div>
						<div class="flex flex-col flex-1 justify-between items-center py-3 w-full min-h-[100px]">
							<div class="w-full">
								<p class="product-2-description">{product.category}</p>
								<p class="product-2-font truncate-name">
									<a href={`/store/${product.id}`} class="hover:text-amber-400">{product.name}</a>
								</p>
							</div>
							<div class="w-full flex flex-col items-center mt-1">
								<p class="text-sm text-gray-600">₱{product.price.toFixed(2)}</p>
								<p class="text-xs text-gray-500 mt-0.5">Stock: {product.stock}</p>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<!-- {#if !$user}
	<div class="flex justify-between px-40 background-color py-24">
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
	.products {
		border-radius: 16px;
		background: var(--Yellow, #f2c94c);
	}

	.product-2-font {
		color: var(--Global-black, #000);
		text-align: center;
		font-family: 'Space Grotesk';
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 20px;
		letter-spacing: 0.5px;
	}

	.product-2-description {
		flex: 1 0 0;
		color: var(--Gray-5, #e0e0e0);
		text-align: center;
		font-family: 'Space Grotesk';
		font-size: 9px;
		font-style: normal;
		font-weight: 600;
		line-height: 14px;
		text-transform: uppercase;
	}

	.image-2 {
		height: 80px;
		width: 100%;
		max-width: 120px;
		background-color: #fafafa;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #fafafa;
		display: block;
	}

	.truncate-name {
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 auto;
	}
</style>
