<script lang="ts">
    import { page } from '$app/stores';
    const orderId = $page.url.searchParams.get('orderId');
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
    <div class="mb-4 rounded-full bg-green-100 p-3">
        <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
    </div>
    
    <h1 class="text-2xl font-bold text-gray-900">Payment Successful</h1>
    <p class="mt-2 text-gray-600">Your order has been confirmed.</p>
    
    <div class="mt-6 bg-gray-50 px-4 py-2 rounded border border-gray-200">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Order Reference</span>
        <div class="font-mono font-medium text-gray-800">{orderId}</div>
    </div>
    
    <a href="/store" class="mt-8 text-sm font-semibold text-black hover:underline">
        Return to Store
    </a>
</div>