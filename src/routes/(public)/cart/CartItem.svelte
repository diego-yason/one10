<script lang="ts">
	import { onMount } from 'svelte';
	import detailNames from './detailNames.json';
	import { cart } from '$lib/stores/cart';
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
</script>

<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 items-center">
	<div class="self-start basis-1/6 rounded-2xl mr-8">
		<img src="https://placehold.co/185x137" class="rounded-xloverflow-clip" alt={name} />
	</div>
	<div class="flex basis-5/6 min-w-0 overflow-hidden">
		<div class="space-y-35 grow min-w-0">
			<div class="min-w-0">
				<h6 class="m-5 font-spaceGrotesk font-bold break-words">
					{name}
				</h6>
				<div class="m-5 text-xs p-2 rounded w-full mb-2 *:mb-1 overflow-hidden">
					{#each Object.entries(details) as [k, v]}
						<div class="break-words overflow-hidden">
							<b>{detailNames[k as keyof typeof detailNames]}</b>
							<span class="break-all">{v}</span>
						</div>
					{/each}
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
					₱{price * quantity}
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
