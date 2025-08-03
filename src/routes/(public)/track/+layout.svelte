<script lang="ts">
	import { goto, preloadData } from '$app/navigation';

	let { children } = $props();

	let value = $state('');

	function preloadTrack() {
		preloadData('/track/' + value);
	}
</script>

<svelte:head>
	<title>Track Order | One10 Studio Labs</title>
</svelte:head>

<form
	class="flex justify-center items-center mx-40 pt-8"
	onsubmit={(e) => {
		e.preventDefault();
		goto('/track/' + value);
	}}
>
	<div class="flex gap-4 items-center">
		<label for="orderId" class="text-xl font-spaceGrotesk font-bold">Order ID</label>
		<input
			type="text"
			id="orderId"
			name="orderId"
			class="bg-slate-300 p-2 rounded-md w-64"
			bind:value
		/>
		<button
			type="submit"
			onfocus={preloadTrack}
			onmouseover={preloadTrack}
			class="bg-amber-400 px-6 py-2 rounded-md"
		>
			Track Order
		</button>
	</div>
</form>

{@render children()}
