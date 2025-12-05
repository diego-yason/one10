<script lang="ts">
	interface ImageData {
		url: string;
		name: string;
		size?: string;
		copies?: number;
	}

	let {
		images = [],
		showModal = $bindable(false),
		initialIndex = 0
	}: {
		images: ImageData[];
		showModal?: boolean;
		initialIndex?: number;
	} = $props();

	let currentImageIndex = $state(initialIndex);

	// Reset index when modal opens or when images change
	$effect(() => {
		if (showModal) {
			// Reset to initialIndex or 0 if initialIndex is out of bounds
			currentImageIndex = initialIndex < images.length ? initialIndex : 0;
		}
	});

	// Also reset when images array changes (different cart item)
	$effect(() => {
		if (images.length > 0 && currentImageIndex >= images.length) {
			currentImageIndex = 0;
		}
	});

	function closeModal() {
		showModal = false;
	}

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeModal();
		if (e.key === 'ArrowRight') nextImage();
		if (e.key === 'ArrowLeft') prevImage();
	}
</script>

{#if showModal && images.length > 0 && images[currentImageIndex]}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div 
		role="dialog"
		aria-modal="true"
		aria-label="Image gallery"
		class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
		onkeydown={handleKeydown}
		onclick={closeModal}
        tabindex=0
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="relative max-w-4xl w-full bg-white rounded-lg p-6 scale-90"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
				onclick={closeModal}
				aria-label="Close modal"
			>
				×
			</button>

			<!-- Image counter -->
			<div class="text-center mb-4 font-semibold text-gray-700">
				{currentImageIndex + 1} / {images.length}
			</div>

			<!-- Main image display -->
			<div class="relative">
				<img 
					src={images[currentImageIndex].url} 
					alt={images[currentImageIndex].name || `Image ${currentImageIndex + 1}`}
					class="w-full max-h-[70vh] object-contain rounded-lg"
				/>

				<!-- Navigation buttons -->
				{#if images.length > 1}
					<button
						class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
						onclick={prevImage}
						aria-label="Previous image"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
						</svg>
					</button>
					<button
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
						onclick={nextImage}
						aria-label="Next image"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Image details -->
			<div class="mt-4 text-center text-sm text-gray-600">
				<p class="font-semibold">{images[currentImageIndex].name}</p>
				{#if images[currentImageIndex].size || images[currentImageIndex].copies}
					<p>
						{#if images[currentImageIndex].size}Size: {images[currentImageIndex].size}{/if}
						{#if images[currentImageIndex].size && images[currentImageIndex].copies} | {/if}
						{#if images[currentImageIndex].copies}Copies: {images[currentImageIndex].copies}{/if}
					</p>
				{/if}
			</div>

			<!-- Thumbnail strip -->
			{#if images.length > 1}
				<div class="flex gap-2 mt-4 overflow-x-auto pb-2">
					{#each images as img, index}
						<button
							class="flex-shrink-0 w-20 h-20 rounded border-2 transition-all {currentImageIndex === index ? 'border-blue-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}"
							onclick={() => currentImageIndex = index}
							aria-label={`View image ${index + 1}`}
						>
							<img src={img.url} alt={img.name || `Thumbnail ${index + 1}`} class="w-full h-full object-cover rounded" />
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}