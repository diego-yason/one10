<script lang="ts">
    export let statusCode: number;
    export let title: string;
    export let message: string;
    export let suggestion: string = "Try refreshing the page or go back to the homepage.";
</script>

<div class="min-h-screen flex items-center justify-center py-20 px-6">
    <div class="max-w-3xl w-full text-center">
        <h1 class="font-spaceGrotesk font-bold text-9xl text-amber-300 mb-6">
            {statusCode}
        </h1>
        <h2 class="font-spaceGrotesk text-4xl text-white font-bold mb-6">
            <span class="textOutline text-transparent">Error</span> {title}
        </h2>
        <p class="font-roboto text-white text-xl mb-8">{message}</p>
        <p class="font-roboto text-gray-300 mb-12">{suggestion}</p>
        
        <div class="flex justify-center">
            <button on:click={() => history.back()} class="border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-colors rounded-4xl px-8 py-3">
                Go Back
            </button>
        </div>
    </div>
</div>

<style>
    .rounded-4xl {
        border-radius: 2rem;
    }
</style>
