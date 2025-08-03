<script lang="ts">
	import { goto } from '$app/navigation';

	let { children } = $props();

	let value = $state('');
</script>

<form
	class="flex w-full justify-between flex-row"
	onsubmit={(e) => {
		e.preventDefault();
		goto('/track/' + value);
	}}
>
	<div class="flex flex-col">
		<label for="orderId" class="text-2xl font-bold">Order ID</label>
		<input
			type="text"
			id="orderId"
			name="orderId"
			class="border-2 border-gray-300 p-2 rounded-md"
			bind:value
		/>
	</div>
	<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
		Track Order
	</button>
</form>

{@render children()}
