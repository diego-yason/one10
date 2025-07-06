<script lang="ts">
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { products, loading, error, loadProducts } from '$lib/stores/products';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

let productId: string = '';
let product = null;
let isLoading = true;
let loadError: string | null = null;

onMount(async () => {
  productId = $page.params.id;
  if (get(products).length === 0) {
    await loadProducts();
  }
  const found = get(products).find((p) => p.id === productId);
  if (found) {
    product = found;
    isLoading = false;
  } else {
    loadError = 'Product not found.';
    isLoading = false;
  }
});

function addToCart() {
  // Implement add to cart logic here
  alert('Added to cart!');
}
</script>

{#if isLoading}
  <div class="flex justify-center items-center h-96 bg-[#6b7283]">
    <p class="text-lg">Loading product...</p>
  </div>
{:else if loadError}
  <div class="flex justify-center items-center h-96 bg-[#6b7283]">
    <p class="text-lg text-red-600">{loadError}</p>
  </div>
{:else}
  <div class="flex flex-col md:flex-row items-center justify-center min-h-[700px] py-4 px-4 bg-[#6b7283]">
    <div class="flex flex-col md:flex-row bg-transparent w-full max-w-3xl mx-auto rounded-2xl">
      <div class="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center md:mr-10 w-full max-w-xs">
        <img src={product.imageUrl || 'https://placehold.co/400x300'} alt={product.name} class="w-72 h-72 object-cover rounded-lg mb-4" />
      </div>
      <div class="mt-8 md:mt-0 flex flex-col items-start max-w-md w-full justify-center">
        <h1 class="text-3xl font-bold mb-4">{product.name}</h1>
        <p class="text-xl font-semibold mb-2">₱{product.price.toFixed(2)}</p>
        <p class="mb-4 text-gray-700">{product.description}</p>
        <p class="mb-4 text-base font-semibold {product.stock > 0 ? 'text-gray-700' : 'text-red-600'}">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div class="flex items-center gap-4 mt-4">
          <button class="bg-amber-300 px-6 py-2 rounded-4xl font-bold text-black disabled:opacity-50" on:click={addToCart} disabled={product.stock === 0}>Add to cart</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .rounded-2xl { border-radius: 1rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .bg-amber-300 { background-color: #F2C94C; }
</style> 