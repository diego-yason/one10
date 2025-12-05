<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    
    const orderId = $page.url.searchParams.get('orderId');
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
    <div class="mb-4 rounded-full bg-red-100 p-3">
        <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </div>
    
    <h1 class="text-2xl font-bold text-gray-900">Payment Failed</h1>
    <p class="mt-2 text-gray-600">The transaction could not be completed.</p>
    
    <div class="mt-8 space-y-3 w-full max-w-xs">
        <form action="/checkout?/getPayment" method="POST" use:enhance>
            <input type="hidden" name="orderId" value={orderId} />
            <button type="submit" class="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 transition">
                Try Again
            </button>
        </form>

        <a href="/cart" class="block w-full text-sm text-gray-500 hover:text-black">
            Return to Cart
        </a>
    </div>
</div>