<script lang="ts">
	import { cart } from "$lib/stores/cart";
	import { onMount } from "svelte";
	import { getImage } from "$lib/db/cartImages";
	import ImageGalleryModal from "./ImageGalleryModal.svelte";

	let {
		i: cartIndex,
		item
	} = $props();

	// Extract data from cart item
	const { details, price, name } = item;
	const uploadedImages = details.uploadedImages ?? [];

	// Total is already precomputed in item.price
	const totalPrice = price;

	// Notes editor
	let editor: HTMLElement;

	// Image urls for all uploaded images
	let imageUrls: string[] = $state([]);
	let showModal = $state(false);

	// Prepare images for modal
	let modalImages = $derived(
		imageUrls.map((url, index) => ({
			url,
			name: uploadedImages[index]?.name || `Image ${index + 1}`,
			size: uploadedImages[index]?.size,
			copies: uploadedImages[index]?.copies
		}))
	);

	onMount(async () => {
		const { default: Quill } = await import("quill");
		const quill = new Quill(editor, {
			modules: { toolbar: false },
			theme: "bubble",
			placeholder: "Do we need to know anything?"
		});

		let timeout: NodeJS.Timeout;

		const save = () => {
			const html = quill.getSemanticHTML();
			cart.update((c) => {
				if (c[cartIndex]) c[cartIndex].notes = html;
				return [...c];
			});
		};

		quill.on("selection-change", (range: any) => {
			if (range) timeout = setTimeout(save, 5000);
			else {
				clearTimeout(timeout);
				save();
			}
		});

		// Load all images
		const urls = await Promise.all(
			details.uploadedImages.map(async (img: any) => {
				const file = await getImage(img.id);
				return file ? URL.createObjectURL(file) : "";
			})
		);
		imageUrls = urls.filter(Boolean);
	});

	function openModal() {
		showModal = true;
	}
</script>

<div class="flex bg-[#D9D9D9] p-5 rounded-xl mt-5 items-start">

	<!-- Image preview with stacked effect -->
	<div class="basis-1/6 rounded-xl mr-8 mt-5">
		<button
			class="relative w-full aspect-square group cursor-pointer"
			onclick={openModal}
			type="button"
			aria-label="View all photos"
		>
			<!-- Main image -->
			{#if imageUrls.length > 0}
				<img 
					src={imageUrls[0]} 
					alt={name} 
					class="rounded-xl w-full h-full object-cover shadow-lg transition-transform group-hover:scale-105 relative z-10" 
				/>
				
				<!-- Stacked effect for multiple images -->
				{#if imageUrls.length > 1}
					<div class="absolute inset-0 bg-white rounded-xl shadow-md -rotate-3 z-0 transition-transform group-hover:-rotate-6"></div>
					<div class="absolute inset-0 bg-white rounded-xl shadow-sm -rotate-6 -z-10 transition-transform group-hover:-rotate-9"></div>
					
					<!-- Badge showing count -->
					<div class="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
						{imageUrls.length} photos
					</div>
				{/if}
				
				<!-- Hover overlay -->
				<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl z-20 flex items-center justify-center">
					<svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
					</svg>
				</div>
			{:else}
				<div class="w-full h-full bg-gray-300 rounded-xl flex items-center justify-center">
					<span class="text-gray-500">Loading...</span>
				</div>
			{/if}
		</button>
	</div>

	<!-- Right side -->
	<div class="flex basis-5/6 min-w-0 overflow-hidden">
		<div class="grow min-w-0 space-y-3">

			<h6 class="font-spaceGrotesk font-bold text-xl mb-3">
				3R to 8R Printing
			</h6>

			<!-- Listing uploaded images -->
			<div class="ml-1 space-y-1 text-sm font-mono">
				{#each uploadedImages as img}
					<div class="flex justify-between">
						<div>
							{img.copies} × {img.size} – {img.name}
						</div>

						<div class="font-semibold">
							P{img.copies * img.price}.00
						</div>
					</div>
				{/each}
			</div>

			<!-- Notes -->
			<div class="mt-4">
				<b>Notes:</b>
				<div id="editor-wrapper">
					<div bind:this={editor}>
						{@html item.notes || ""}
					</div>
				</div>
			</div>

			<div class="mt-6 font-bold text-lg">
				TOTAL: P{totalPrice}.00
			</div>
		</div>

		<!-- Remove -->
		<button
			class="ml-4 text-red-600 font-bold text-lg"
			onclick={() => cart.update(c => (c.splice(cartIndex,1), [...c]))}
		>
			🗑
		</button>
	</div>
</div>

<!-- Image Gallery Modal -->
<ImageGalleryModal bind:showModal images={modalImages} />

<style>
	#editor-wrapper div {
		min-height: 40px;
	}
</style>