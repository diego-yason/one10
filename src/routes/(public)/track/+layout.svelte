<script lang="ts">
	import { goto } from '$app/navigation';

	let { children } = $props();

	let value = $state('');
</script>

<svelte:head>
	<title>Track Order | One10 Studio Labs</title>
</svelte:head>

<form
	class="flex justify-between flex-row mx-40"
	onsubmit={(e) => {
		e.preventDefault();
		goto('/track/' + value);
	}}
>
	<div class="flex flex-col">
		<label for="orderId" class="text-xl basis-1/3 font-spaceGrotesk font-bold">Order ID</label>
		<input
			type="text"
			id="orderId"
			name="orderId"
			class="bg-slate-300 w-full p-2 rounded-md"
			bind:value
		/>
	</div>
	<button type="submit" class="bg-amber-400 px-2 py-1 rounded-md mt-4"> Track Order </button>
</form>

{@render children()}
