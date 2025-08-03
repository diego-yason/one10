<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let { orders } = $derived(data);
</script>

<input
	type="text"
	placeholder="Search Order Number or Customer Name"
	class="px-5 py-3 rounded-lg bg-white border-0 w-110"
/>
<div class="flex flex-col mt-8">
	<div class="flex mb-5 justify-between">
		<p class="font-bold text-xl">Orders:</p>

		<button
			class="font-bold rounded-2xl bg-white px-7 hover:cursor-pointer hover:bg-black hover:text-white"
			>Filter</button
		>
	</div>

	<div class="flex flex-col space-y-11">
		{#each orders as order}
			<div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
				<div class="flex justify-between">
					<p class="font-bold">Order {order.id}</p>

					<p class="flex items-center gap-3">
						{order.status.replace('_', ' ')}
						<span
							class="rounded-3xl w-5 h-5"
							class:bg-yellow-300={['pending_payment', 'awaiting_films'].includes(order.status)}
							class:bg-red-300={['cancelled', 'refunded'].includes(order.status)}
							class:bg-green-300={['completed'].includes(order.status)}
							class:bg-blue-300={['processing'].includes(order.status)}
						></span>
					</p>
				</div>

				<p>Customer Name: <span class="font-bold">{order.name}</span></p>

				<div class="flex justify-between">
					<button
						class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl"
					>
						View Details
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
