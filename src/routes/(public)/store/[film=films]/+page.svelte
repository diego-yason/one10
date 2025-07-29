<script lang="ts">
	import { user } from '$lib/stores/auth';
	import { add, showToast, toast } from '$lib/stores/cart';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types.js';
	import type { CartItem } from '$types/Cart';
	import { addonNames } from './schema.js';

	let { data, form }: PageProps = $props();
	const { film, filmCode } = $derived(data);

	let pushProcessing = $state(0);
	let filmBrand = $state('');
	let processType = $state<'' | 'c41' | 'bw' | 'ecn2'>('');
	let returningNegatives = $state('');
	let scanOption = $state('');

	import prices from './priceRef.json';
	const { pushProcess: pushProcessPrice, scan: scanAddon, process: processPrice } = prices;

	let isGeneric = $state(false);
	$effect(() => {
		if (isGeneric) {
			filmBrand = 'Generic Brand';
		} else if (filmBrand === 'Generic Brand') {
			filmBrand = '';
		}
	});
	let returning = $state(false);
	let disabled = $state(false);

	let price = $derived.by(() => {
		const push = pushProcessPrice[pushProcessing] ?? 0;
		const scan = scanOption == 'scan' ? (scanAddon[processType] ?? 0) : 0;
		const process = processPrice[processType] ?? 0;
		return push + scan + process;
	});
</script>

<div class="flex flex-col max-w-4xl w-full ml-32 mx-auto">
	<div class="flex flex-col items-start mb-12">
		<h2 class="font-spaceGrotesk font-bold text-7xl mb-8">
			Develop <span class="textOutline text-transparent">+ Scanning</span>
		</h2>
		<img
			src="https://placehold.co/350x250"
			alt={film}
			class="rounded-lg w-[350px] h-[250px] object-cover bg-white"
		/>
	</div>

	<h2 class="font-spaceGrotesk font-bold text-5xl mb-2 capitalize">{film}</h2>
	<!-- <p class="text-gray-400 text-2xl mb-8">P200</p> -->

	<form
		method="POST"
		class="w-full flex flex-col gap-6 mt-8"
		use:enhance={() => {
			return async ({ result, formElement }) => {
				if (result?.type === 'success') {
					add(result.data!.item as unknown as CartItem);
					showToast('Added to cart!');
					formElement.reset();
				} else {
					showToast('There was an error adding to cart.');
				}
			};
		}}
	>
		<input type="hidden" name="id" value="dev-{filmCode}" />
		<input type="hidden" name="quantity" value="1" />
		<div>
			<label for="filmBrand" class="block font-bold mb-2 text-sm">FILM BRAND NAME</label>
			<input
				type="text"
				name="filmBrand"
				class="w-full px-4 py-2 rounded bg-white border-red-500"
				class:border-2={form?.issues?.['details.brand']}
				placeholder="Type your film's brand name"
				id="filmBrand"
				readonly={isGeneric}
				bind:value={filmBrand}
			/>
			{#if form?.issues?.['details.brand']}
				<p class="text-red-500 text-sm mt-1">{form.issues['details.brand']}</p>
			{/if}
			<input type="checkbox" name="genericBrand" id="genericBrand" bind:checked={isGeneric} />
			<label for="genericBrand" class="font-openSans font-bold uppercase text-sm">
				Generic Brand
			</label>
		</div>
		<div>
			<label for="processType" class="block font-bold mb-2 text-sm">PROCESS TYPE</label>
			<select
				class="w-full px-4 py-2 rounded border-red-500 bg-white"
				class:border-2={form?.issues?.['details.processType']}
				bind:value={processType}
				id="processType"
				name="processType"
			>
				<option disabled selected hidden value="">Select process type</option>
				<option value="c41">C41 (P{processPrice['c41']})</option>
				<option value="bw">Black & White (P{processPrice['bw']})</option>
				` <option value="ecn2">ECN 2 (P{processPrice['ecn2']})</option>
			</select>
			{#if form?.issues?.['details.process']}
				<p class="text-red-500 text-sm mt-1">{form.issues['details.process']}</p>
			{/if}
		</div>
		<div>
			<label class="block font-bold mb-2 text-sm" for="pushProcessing">PUSH PROCESSING</label>
			<div class="flex items-center gap-4">
				<input
					id="pushProcessing"
					name="pushProcessing"
					type="range"
					min="0"
					max="3"
					step="1"
					bind:value={pushProcessing}
					class="w-40"
				/>
				<p>
					<span class="font-bold">{pushProcessing}</span>
					<span class="bg-amber-400 px-2 ml-2 rounded-lg py-1">
						(+P{pushProcessPrice[pushProcessing] ?? 0})
					</span>
				</p>
			</div>
		</div>
		<div>
			<span class="block font-bold mb-2 text-sm">RETURNING NEGATIVES</span>
			<input type="checkbox" id="returningNegativesCB" bind:checked={returning} />
			<input type="hidden" name="returningNegatives" value="false" disabled={returning} />
			<label class="font-openSans font-bold uppercase text-sm" for="returningNegativesCB">
				I'd like to get my negatives back
			</label>

			{#if returning}
				<select
					transition:slide={{ duration: 300, axis: 'y' }}
					id="returningNegatives"
					name="returningNegatives"
					class="w-full px-4 py-2 block rounded bg-white border-red-500 mb-2"
					class:uppercase={returningNegatives !== ''}
					class:border-2={form?.issues?.['details.receiptMethod']}
					bind:value={returningNegatives}
				>
					<option selected disabled hidden value="">
						Select how would you like to get your negatives back
					</option>
					<option class="uppercase" value="mobile">mobile app courier (lalamove, grab, etc.)</option
					>
					<option class="uppercase" value="traditional">traditional courier (lbc, j&t, etc.)</option
					>
					<option class="uppercase" value="self">self pick-up at the lab in Muntinlupa City</option>
				</select>
				<span class="bg-amber-400 px-2 ml-2 rounded-lg py-1">
					NOTE: Total price is exclusive of return shipping fees.
				</span>
				{#if form?.issues?.['details.receiptMethod']}
					<p class="text-red-500 text-sm mt-1">{form.issues['details.receiptMethod']}</p>
				{/if}
			{/if}
		</div>
		<div class="flex flex-col gap-2 mt-2">
			<span class="font-openSans font-bold uppercase text-sm">Develop + Scan Promo</span>
			<label class="font-openSans font-semibold uppercase text-sm">
				<input type="radio" name="scanOption" value="scan" bind:group={scanOption} />
				SCAN FILM AND EMAIL ME SOFT COPIES
				<span class="bg-amber-400 px-2 ml-2 rounded-lg py-1">(+P{scanAddon[processType]})</span>
			</label>
			<label class="font-openSans font-semibold uppercase text-sm">
				<input type="radio" name="scanOption" value="process" bind:group={scanOption} />
				PROCESS ONLY (I WILL SCAN AND PRINT ON MY OWN)
			</label>
		</div>
		{#if form?.issues?.['details.scanOption']}
			<p class="text-red-500 text-sm mt-1">{form.issues['details.scanOption']}</p>
		{/if}
		<div class="flex flex-row justify-between whitespace-nowrap mt-6 items-end">
			<p class="text-2xl bg-amber-300 px-2 py-2 rounded-2xl">
				Total Price: <span class="font-bold">P{price ?? 0}</span>
			</p>
			<button
				type="submit"
				{disabled}
				class="px-8 bg-amber-300 py-2 rounded-2xl font-bold text-black"
			>
				Add to cart
			</button>
		</div>
	</form>
</div>

<section class="w-full mt-16 flex flex-col md:flex-row">
	<div
		class="bg-amber-300 flex-1 flex flex-col justify-center items-start py-16 px-10"
		style="padding-left: 8rem;"
	>
		<h2 class="text-4xl font-bold mb-8">Reminders</h2>
		<div>
			<h3 class="text-2xl font-bold mb-4">We only accept</h3>
			<ul class="text-lg text-gray-700 font-medium space-y-2">
				<li>135mm/35 mm Disposables</li>
				<li>120 format/ Medium format</li>
				<li>C-41/C16 Process</li>
				<li>Black and White Process</li>
				<li>Push Processing</li>
			</ul>
		</div>
	</div>
	<div
		class="flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-cover bg-center"
		style="background-image: url('https://placehold.co/350x250');"
	>
		<h2 class="text-3xl font-bold mb-6 text-black">Got some questions?</h2>
		<a href="/faq" class="bg-amber-300 rounded-4xl px-8 py-3 font-bold text-black text-lg"
			>Read our FAQs</a
		>
	</div>
</section>
{#if !$user}
	<div class="flex justify-between px-40 background-color py-24">
		<div>
			<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
				<span class="block textOutline text-transparent">Sign up</span> and save
			</h2>
			<p class="text-white font-roboto">Register and Subscribe to get special offers</p>
		</div>
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">
			Register / Log in
		</a>
	</div>
{/if}

<style>
	input[type='range'].w-40::-webkit-slider-runnable-track {
		background: #e5b700; /* Unfilled track color (optional, can omit) */
	}
	input[type='range'].w-40::-webkit-slider-thumb {
		-webkit-appearance: none;
	}
	input[type='range'].w-40::-webkit-slider-thumb {
		/* No size or color changes here */
	}
	input[type='range'].w-40::-webkit-slider-runnable-track {
		background: linear-gradient(
			to right,
			#fbbf24 0%,
			/* Highlight color */ #fbbf24 calc(var(--value) * 33.33%),
			#e5b700 calc(var(--value) * 33.33%),
			#e5b700 100%
		);
	}
	input[type='range'].w-40 {
		accent-color: #fbbf24; /* Modern browsers */
	}

	/* Firefox */
	input[type='range'].w-40::-moz-range-progress {
		background-color: #fbbf24;
	}
	input[type='range'].w-40::-moz-range-track {
		background-color: #e5b700;
	}

	/* IE/Edge */
	input[type='range'].w-40::-ms-fill-lower {
		background-color: #fbbf24;
	}
	input[type='range'].w-40::-ms-fill-upper {
		background-color: #e5b700;
	}
</style>
