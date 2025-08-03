<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let { grandTotal, id, items, status, notes } = $derived(data);
</script>

<div class="flex-col mx-40 text-[#333] mb-20">
	<h1 class="text-7xl font-bold font-spaceGrotesk">Track</h1>
	<!--Order container-->
	<div class="bg-[#F2C94C] text-black p-8 rounded-2xl my-10 shadow-xl">
		<h2 class="text-4xl pb-2">{id}</h2>
		{#each items as item}
			<p>{item.name}</p>
			{#each Object.keys(item.details).map( ([key, value]) => ({ name: key, price: value }) ) as detail}
				<p class="pl-4">{detail.name} - {detail.price}</p>
			{/each}
			{#each item.addons ?? [] as addon}
				<p class="pl-4">{addon.name} - {addon.price}</p>
			{/each}
		{/each}
		<div class="w-4/5 mx-auto m-10 mb-5 flex items-baseline justify-between">
			<div class="flex gap-10 items-start">
				<div class="w-15 h-15 border-6 bg-black rounded-full"></div>
				<div class="w-15 h-15 border-6 bg-black rounded-full"></div>
				<div class="w-15 h-15 border-6 bg-black rounded-full"></div>
				<div class="w-15 h-15 border-6 bg-black rounded-full"></div>
			</div>
			<div class="flex items-center flex-col gap-3">
				<div class="w-15 h-15 border-6 rounded-full"></div>
				<p>For Scanning</p>
			</div>
			<div class="flex gap-10 items-start">
				<div class="w-15 h-15 border-6 rounded-full"></div>
			</div>
		</div>
	</div>
</div>
