<script lang="ts">
	import { products, loading, error, loadProducts } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import { user, isStaffUser } from '$lib/stores/auth';

	onMount(() => {
		loadProducts();
	});

	// Show all products for display in shop
	$: allProducts = $products;
</script>

<div class="py-10 h-screen mb-8">
    <div class="flex flex-col px-32 py-24 mt-10">
        <h1 class="services-font">Services</h1>
                
        <div class="grid grid-cols-4 gap-18 py-10">
            <div class="products flex flex-col">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="font-bold underline text-lg mb-1">Disposable Camera Service</p>
                    <p class="text-base">from P150</p>
                </div>
            </div>
            <div class="products flex flex-col w-349px">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="font-bold underline text-lg mb-1">35mm Services</p>
                    <p class="text-base">from P150</p>
                </div>
            </div>
            <div class="products flex flex-col w-349px">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="font-bold underline text-lg mb-1">120 Film Services</p>
                    <p class="text-base">from P200</p>
                </div>
            </div>
            <div class="products flex flex-col w-349px">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="font-bold underline text-lg mb-1">3R - 8R Printing</p>
                    <p class="text-base">from P8.00</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="mb-20">
    <div class="flex flex-col px-32 py-24 mt-15 h-screen">
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
                        <div class="image-2 flex items-center justify-center relative">
                            {#if product.imageUrl}
                                <img src={product.imageUrl} alt={product.name} class="w-full h-full object-cover" />
                            {:else}
                                <span class="text-gray-400">No Image</span>
                            {/if}
                            {#if product.status !== 'available'}
                                <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10">Sold Out</span>
                            {/if}
                        </div>
                        <div class="flex flex-col justify-center items-center py-10">
                            <p class="product-2-description">{product.category}</p>
                            <p class="product-2-font">{product.name}</p>
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

<div class="py-48 flex justify-between px-40 mt-150 background-color">
	<div>
		<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
			<span class="block textOutline text-transparent">Sign up</span> and save
		</h2>
		<p class="text-white font-roboto">Register and Subscribe to get special offers</p>
	</div>
	{#if !$user}
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Register / Log in</a>
	{:else if isStaffUser($user)}
		<a href="/dashboard" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Go to Dashboard</a>
	{:else}
		<a href="/cart" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Go to Cart</a>
	{/if}
</div>


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
            width: 349px;
            height: 391px;
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
            background-color: #333;
        }

        .background-color{
           background: var(--Gray-2, #4F4F4F);
        }
    </style>