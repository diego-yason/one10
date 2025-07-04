<script lang="ts">
	import { products, loading, error, loadProducts } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import { user, isStaffUser } from '$lib/stores/auth';

	onMount(() => {
		loadProducts();
	});

	// Show all products for display in shop
	$: allProducts = $products;

	let selectedService: string | null = null;
	let pushProcessing = 1;
</script>

<div class="py-10">
    <div class="flex flex-col max-w-4xl w-full ml-20 p-4 sm:p-8 md:p-12">
        {#if !selectedService}
        <h1 class="services-font">Services</h1>
        {/if}
        {#if !selectedService}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-4 py-4 w-full mx-auto px-4">
            <a href="/services/disposable" class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden">
                <img src="https://placehold.co/350x250" alt="Disposable Camera" class="w-full h-36 object-cover" />
                <div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
                    <p class="font-bold underline text-base mb-1">Disposable Camera Service</p>
                    <p class="text-sm">from P150</p>
                </div>
            </a>
            <a href="/services/35mm" class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden">
                <img src="https://placehold.co/350x250" alt="35mm Film" class="w-full h-36 object-cover" />
                <div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
                    <p class="font-bold underline text-base mb-1">35mm Services</p>
                    <p class="text-sm">from P150</p>
                </div>
            </a>
            <a href="/services/120mm" class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden">
                <img src="https://placehold.co/350x250" alt="120mm Film" class="w-full h-36 object-cover" />
                <div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
                    <p class="font-bold underline text-base mb-1">120 Film Services</p>
                    <p class="text-sm">from P200</p>
                </div>
            </a>
            <a href="/services/printing" class="products flex flex-col cursor-pointer shadow-lg min-w-[260px] max-w-[340px] bg-white rounded-2xl overflow-hidden">
                <img src="https://placehold.co/350x250" alt="3R - 8R Printing" class="w-full h-36 object-cover" />
                <div class="bg-amber-300 flex flex-col items-center justify-center rounded-b-2xl pt-2 pb-2">
                    <p class="font-bold underline text-base mb-1">3R - 8R Printing</p>
                    <p class="text-sm">from P8.00</p>
                </div>
            </a>
        </div>
        {/if}
        {#if selectedService === 'disposable'}
        // Removed: moved to /services/disposable
        {/if}
    </div>
</div>

{#if !selectedService}
<div>
    <div class="flex flex-col px-32 py-8 mt-4">
        <h1 class="services-font">
            Shop
        </h1>

        {#if $loading}
            <div class="flex justify-center items-center py-20">
                <p class="text-lg">Loading products...</p>
            </div>
        {:else if $error}
            <div class="flex justify-center items-center py-20">
                <p class="text-red-500">Error loading products: {$error}</p>
            </div>
        {:else if allProducts.length === 0}
            <div class="flex justify-center items-center py-20">
                <p class="text-lg text-gray-500">No products available at the moment.</p>
            </div>
        {:else}
            <div class="grid grid-cols-4 gap-10 py-10">
                {#each allProducts as product}
                    <div class="product-2 flex flex-col relative">
                        <div class="image-2 flex items-center justify-center relative bg-[#FAFAFA]">
                            <a href={`/product/${product.id}`}> 
                                {#if product.imageUrl}
                                    <img src={product.imageUrl} alt={product.name} class="w-full h-full object-contain bg-[#FAFAFA]" />
                                {:else}
                                    <span class="text-gray-400">No Image</span>
                                {/if}
                            </a>
                            {#if product.status !== 'available'}
                                <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10">Sold Out</span>
                            {/if}
                        </div>
                        <div class="flex flex-col justify-center items-center py-10">
                            <p class="product-2-description">{product.category}</p>
                            <p class="product-2-font">
                                <a href={`/product/${product.id}`} class="hover:text-amber-400">{product.name}</a>
                            </p>
                            <p class="text-sm text-gray-600 mt-2">₱{product.price.toFixed(2)}</p>
                            <p class="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                            {#if !$user || !isStaffUser($user)}
                                <button class="border rounded-lg px-6 py-2 font-spaceGrotesk mt-10" disabled={product.status !== 'available'}>{product.status !== 'available' ? product.status.replaceAll('_', ' ') : 'Add to cart'}</button>
                            {:else}
                                <span class="border rounded-lg px-6 py-2 font-spaceGrotesk mt-10 bg-gray-100 text-gray-400 cursor-not-allowed">Staff view</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
{/if}

{#if !$user}
<div class="flex justify-between px-40 background-color py-24">
    <div>
        <h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
            <span class="block textOutline text-transparent">Sign up</span> and save
        </h2>
        <p class="text-white font-roboto">Register and Subscribe to get special offers</p>
    </div>
    <a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Register / Log in</a>
</div>
{/if}

    <style>
        .services-font{
            color: var(--Gray-1, #333);
            /* Headings/h1 */
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: var(--Gray-1, #333);
            font-family: "Space Grotesk";
            font-size: 80px;
            font-style: normal;
            font-weight: 700;
            line-height: 88px; /* 110% */
            letter-spacing: -1.6px;
        }

        .products{
            border-radius: 16px;
            background: var(--Yellow, #F2C94C);
        }

        .image{
            height: 257px;
            flex-shrink: 0;
            border-radius: 16px 16px 0px 0px;
        }

        .products-font-name{
            color: var(--Global-black, #000);
            text-align: center;
            font-family: "Space Grotesk";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px; /* 200% */
            letter-spacing: 1.2px;
            text-decoration-line: underline;
            text-decoration-style: solid;
            text-decoration-skip-ink: none;
            text-decoration-thickness: auto;
            text-underline-offset: auto;
            text-underline-position: from-font;
        }

        .products-font-price{
            width: 106px;
            color: var(--Global-black, #000);
            text-align: center;
            font-family: "Open Sans";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 150% */
        }

        .product-2{
            display: flex;
            padding: 40px 30px;
            flex-direction: column;
            align-items: flex-start;
            align-self: stretch;
            background: #FAFAFA;
            border-radius: 16px;
        }

        .product-2-font{
            color: var(--Global-black, #000);
            text-align: center;
            /* headings/h5 */
            font-family: "Space Grotesk";
            font-size: 22px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px; /* 145.455% */
            letter-spacing: 1.2px;
        }

        .product-2-description{
            flex: 1 0 0;
            color: var(--Gray-5, #E0E0E0);
            text-align: center;
            font-family: "Space Grotesk";
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px;
            text-transform: uppercase;
        }

        .image-2{
            height: 214px;
            align-self: stretch;
            background-color: #FAFAFA;
        }

        .background-color{
           background: var(--Gray-2, #4F4F4F);
        }
    </style>

    {#if selectedService}
    {/if}