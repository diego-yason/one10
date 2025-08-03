<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let { grandTotal, id, items, status, notes, currentStep, step, stepCount } = $derived(data);

	const errorSteps = ['Payment Failed', 'Payment Cancelled', 'Payment Expired'];

	import detailName from '$public/cart/detailNames.json';
</script>

<div class="flex-col mx-40 text-[#333] mb-20">
	<h1 class="text-7xl font-bold font-spaceGrotesk">Track</h1>
	<!--Order container-->
	<div class="bg-[#F2C94C] text-black p-8 rounded-2xl my-10 shadow-xl">
		<h2 class="text-4xl pb-2">{id}</h2>
		{#each items as item}
			<p>{item.name}</p>
			{#each Object.keys(item.details).map( ([key, value]) => ({ name: key, price: value }) ) as { name, price }}
				<p class="pl-4">{detailName[name as keyof typeof detailName]} - {price}</p>
			{/each}
			{#each item.addons ?? [] as addon}
				<p class="pl-4">{addon.name} - {addon.price}</p>
			{/each}
		{/each}
		<div class="w-4/5 mx-auto m-10 mb-5 flex items-baseline justify-between">
			<div class="flex gap-10 items-start">
				{#each Array(currentStep - 1).fill(0) as _, index}
					<div class="w-15 h-15 border-6 bg-black rounded-full"></div>
				{/each}
			</div>
			<div class="flex items-center flex-col gap-3">
				{#if errorSteps.includes(step)}
					<div class="w-15 h-15 border-6 bg-red-600 border-red-600 rounded-full"></div>
				{:else if step}
					<div class="w-15 h-15 border-6 rounded-full"></div>
				{/if}
				<p class="font-bold font-openSans" class:text-red-800={errorSteps.includes(step)}>{step}</p>
			</div>
			<div class="flex gap-10 items-start">
				{#each Array(stepCount - currentStep).fill(0) as _}
					<div class="w-15 h-15 border-6 rounded-full"></div>
				{/each}
			</div>
		</div>
	</div>
</div>
