<script lang="ts">
	import { user } from '$lib/stores/auth';

	let { data } = $props();
	let { products } = $derived(data);
</script>

<div class="py-10">
	<div class="flex flex-col ml-20 p-4 sm:p-8 md:p-12">
		<h1 class="text-[#333] font-spaceGrotesk text-7xl font-bold">Services</h1>
		<div class="flex flex-wrap w-full justify-start gap-12 py-4 px-4">
			<a
				href="/store/disposable"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img
					src="https://placehold.co/350x250"
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
				<img src="https://placehold.co/350x250" alt="35mm Film" class="w-full h-36 object-cover" />
				<div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
					<p class="font-bold underline text-base mb-1">35mm Services</p>
					<p class="text-sm">from P150</p>
				</div>
			</a>
			<a
				href="/store/120mm"
				class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden"
			>
				<img src="https://placehold.co/350x250" alt="120mm Film" class="w-full h-36 object-cover" />
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

		<div class="flex flex-wrap justify-start gap-x-30 gap-y-10 py-10">
			{#each products as product}
				<div
					class="px-5 py-2.5 items-center self-stretch bg-[#fafafa] rounded-2xl
				flex flex-col relative"
				>
					<div class="image-2 flex items-center justify-center relative bg-[#FAFAFA]">
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
					<div class="flex flex-col flex-1 justify-between items-center py-10 w-full min-h-[160px]">
						<div class="w-full">
							<p class="product-2-description">{product.category}</p>
							<p class="product-2-font truncate-name">
								<a href={`/store/${product.id}`} class="hover:text-amber-400">{product.name}</a>
							</p>
						</div>
						<div class="w-full flex flex-col items-center mt-4">
							<p class="text-sm text-gray-600 mt-2">₱{product.price.toFixed(2)}</p>
							<p class="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

{#if !$user}
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
{/if}

<style>
	.products {
		border-radius: 16px;
		background: var(--Yellow, #f2c94c);
	}

	.product-2-font {
		color: var(--Global-black, #000);
		text-align: center;
		font-family: 'Space Grotesk';
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: 24px;
		letter-spacing: 1px;
	}

	.product-2-description {
		flex: 1 0 0;
		color: var(--Gray-5, #e0e0e0);
		text-align: center;
		font-family: 'Space Grotesk';
		font-size: 10px;
		font-style: normal;
		font-weight: 600;
		line-height: 16px;
		text-transform: uppercase;
	}

	.image-2 {
		height: 120px;
		width: 180px;
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
		max-width: 180px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 auto;
	}
</style>
