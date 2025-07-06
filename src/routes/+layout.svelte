<script lang="ts">
	import { firebase } from '$lib/firebase'; // initialize Firebase
	firebase.getFirebaseApp();

	let { children } = $props();
	import '../app.css';

	import { toast } from '$lib/stores/cart';
</script>

{#if $toast}
	<div class="fixed top-6 right-6 z-50 bg-amber-400 text-black px-6 py-3 rounded-lg shadow-lg font-bold animate-fade-in">
		{$toast}
	</div>
{/if}

<div class="font-openSans bg-gray-500">
	{@render children()}
</div>

<style>
	.animate-fade-in {
		animation: fadeIn 0.2s;
	}
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
