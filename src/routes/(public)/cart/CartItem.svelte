<script lang="ts">
	import { onMount } from 'svelte';
	import detailNames from './detailNames.json';
	import { cart } from '$lib/stores/cart';
	import { addonNames } from '../store/[film=films]/schema';
	let {
		i: cartIndex,
		name,
		price,
		quantity,
		details,
		imageUrl,
		updateQuantity,
		removeItem,
		notes = '',
		addons = []
	} = $props();

	$effect(() => {
		if (quantity <= 0) removeItem(cartIndex);
		else updateQuantity(cartIndex, quantity);
	});

	let editor: HTMLElement;
	onMount(async () => {
		const { default: Quill } = await import('quill');
		const quill = new Quill(editor, {
			// placeholder: 'Anything we need to know?',
			modules: {
				toolbar: false
			},
			formats: ['italic', 'bold'],
			theme: 'bubble',
			placeholder: 'Do we need to know anything?'
		});

		let timeout: NodeJS.Timeout;
		quill.on('selection-change', (range) => {
			function saveContent() {
				const html = quill.getSemanticHTML();

				if (html === notes) return; // No change, skip update
				cart.update((cart) => {
					const item = cart[cartIndex];
					if (item) {
						item.notes = html;
					}
					return [...cart];
				});
			}
			// every 5 seconds while the editor is focused, save the content to the cart store
			if (range) {
				timeout = setTimeout(saveContent, 5000);
			} else {
				// Editor lost focus
				clearTimeout(timeout);
				saveContent();
			}
		});
	});

	const totalPrice = $derived.by(() => {
		return (price + (addons?.reduce((acc, addon) => acc + addon.price, 0) ?? 0)) * quantity;
	});
</script>

<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 items-center">
	<div class="self-start basis-1/6 rounded-2xl mr-8">
		<img src="https://placehold.co/185x137" class="rounded-xl overflow-clip" alt={name} />
	</div>
	<div class="flex basis-5/6 min-w-0 overflow-hidden">
		<div class="space-y-35 grow min-w-0">
			<div class="min-w-0">
				<h6 class="m-5 font-spaceGrotesk font-bold break-words">
					{name}
					<div class="font-light">Base Price: P{price}</div>
				</h6>
				<div class="m-5 text-xs p-2 rounded w-full mb-2 *:mb-1 overflow-hidden">
					{#if Object.keys(details).length > 0}
						<span class="font-semibold font-spaceGrotesk text-lg">Details</span>
						{#each Object.entries(details) as [k, v]}
							{@const ref = detailNames[k as keyof typeof detailNames]}
							<div class="break-words overflow-hidden">
								<b>{ref.name}</b>
								<span class="break-all">
									<!-- complicated due to typescript -->
									{'values' in ref && ref.values
										? (ref.values[v as keyof typeof ref.values] ?? v)
										: v}
								</span>
							</div>
						{/each}
					{/if}
					{#if addons.length > 0}
						<span class="font-semibold font-spaceGrotesk text-lg">Addons</span>
						{#each addons as addon}
							<div class="break-words overflow-hidden">
								<span>
									<b>{addonNames[addon.name] ?? addon.name}</b>
									{#if addon.quantity}
										<span class="text-gray-500">({addon.quantity})</span>
									{/if}
									<span>P{addon.price}</span>
								</span>
								<span class="break-all">{addon.value}</span>
							</div>
						{/each}
					{/if}
					<div class="w-full break-words overflow-hidden">
						<b>Notes:</b>
						<div id="editor-wrapper">
							<div bind:this={editor}>
								<!-- This is from trusted input. -->
								{@html notes}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div class="flex flex-row w-full justify-between">
					<div class="flex border-1 w-32 m-5 rounded-lg justify-around">
						<button
							class="px-1.5 basis-1/4 py-3 border-r-[1px] border-black"
							onclick={() => quantity--}
							disabled={quantity <= 0}
						>
							-
						</button>
						<input type="number" min="0" class="w-12 text-center no-spinner" value={quantity} />
						<button
							class="px-1.5 basis-1/4 py-3 border-l-[1px] border-black"
							onclick={() => quantity++}>+</button
						>
					</div>
					<button class="text-red-600 font-bold mr-5" onclick={() => removeItem(cartIndex)}
						>Remove</button
					>
				</div>
				<h6 class="text-left font-bold" style="margin-top:0.25rem;">
					P{totalPrice}
				</h6>
			</div>
		</div>
	</div>
</div>

<style>
	.no-spinner::-webkit-outer-spin-button,
	.no-spinner::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.no-spinner[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
	.no-spinner:focus,
	.no-spinner:active {
		outline: none;
		border: none;
		box-shadow: none;
	}
</style>
