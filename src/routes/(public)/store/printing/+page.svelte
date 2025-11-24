<!--Temporary Form Fields-->
<script lang="ts">
	import { user, isStaff } from '$lib/stores/auth';
	import type { UploadSchema } from './schema';
	import { cart, showToast, add } from '$lib/stores/cart';
	import background from "$lib/imgs/backgrounds/img9.jpg";
	import { fade } from "svelte/transition";

	// Field states
	let pickupMode = $state("");
	let pickupOther = $state("");
	let uploadedImages : UploadSchema[] = $state([]);
	let total = $state(0);

	// Clear other field when chosen
	$effect(() => {
		if (pickupMode === "other")
			pickupOther = "";
	});

	let errorMessages: string[] = [];
	let fieldErrors: Record<string, string> = {};

	let nextId = 1;
	// Handle file upload
	function handleFileUpload(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (!files) return;

		for (const file of files) {
			const reader = new FileReader();
			const id = nextId++;

			reader.onload = (e) => {
				uploadedImages = [
					...uploadedImages,
					{
						id,
						file,
						name: file.name,
						preview: e.target?.result as string,
						copies: 1,
						size: "3R",
						price: 100, // placeholder
						fitMode: "fit" // placeholder
					},
				];
				updateTotal();
			};

			reader.readAsDataURL(file);
		}

		// reset input
		(event.target as HTMLInputElement).value = "";
	}

	function increaseCopies(index: number) {
		uploadedImages[index].copies++;
		updateTotal();
	}

	function decreaseCopies(index: number) {
		if (uploadedImages[index].copies > 1) {
			uploadedImages[index].copies--;
			updateTotal();
		}
	}

	function changeSize(index: number, event: Event) {
		const size = (event.target as HTMLSelectElement).value;
		uploadedImages[index].size = size;
		updateTotal();
	}

	function removeImage(index: number) {
		uploadedImages.splice(index, 1);
		updateTotal();
	}

	function changeFitMode(index: number, e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		uploadedImages[index].fitMode = value;
		uploadedImages = [...uploadedImages]; // ensure reactivity
	}

	function updateTotal() {
		total = uploadedImages.reduce(
			(sum, img) => sum + img.copies * img.price,
			0
		);
	}

	async function handleSubmit(e: SubmitEvent) {
		try {
			e.preventDefault();

			const formData = new FormData();

			formData.append("pickupMode", pickupMode);
			formData.append("pickupOther", pickupOther);

			for (const img of uploadedImages) {
				formData.append("files", img.file);
				formData.append("meta", JSON.stringify({
					id: img.id,
					name: img.name,
					preview: img.preview,
					copies: img.copies,
					size: img.size,
					price: img.price,
					fitMode: img.fitMode
				}));
			}

			const request = {
				"method": "POST",
				"body": formData
			}

			const response = await fetch("/store/printing", request);

		}
		catch (err) {
			console.log("Error in submitting", err);
		}

	}
</script>

<div class="px-30">
	<a href="/store" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
		</svg>
		Back to Store
	</a>
</div>

<div class="flex flex-col max-w-4xl w-full ml-32 mx-auto">
	<div class="flex flex-col items-start mb-12">
		<h2 class="font-spaceGrotesk font-bold text-7xl mb-8">Printing</h2>
		<img
			src={background || 'https://placehold.co/350x250'}
			alt="Printing"
			class="rounded-lg w-[350px] h-[250px] object-cover bg-white"
		/>
	</div>
	<h2 class="font-spaceGrotesk font-bold text-5xl mb-2">3R to 8R Printing</h2>
	<p class="text-gray-400 text-2xl mb-8">P8</p>

	{#if errorMessages.length}
		<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
			<ul>
				{#each errorMessages as errMsg}
					<li>{errMsg}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="w-full flex flex-col gap-6">
	<!-- Upload field -->
		<div>
			<label class="block font-bold mb-2 text-sm" for="upload">UPLOAD YOUR PHOTOS*</label>
			<input
				data-testid="file-input"
				type="file"
				id="upload"
				multiple
				onchange={handleFileUpload}
				class="w-full px-4 py-2 border rounded bg-white"
				accept="image/*"
			/>
		</div>
		{#if uploadedImages.length > 0}
		<section class="bg-gray-50 p-6 rounded-lg shadow-md">
			<h3 class="text-2xl font-bold mb-4">Preview & Adjustments</h3>
			<div class="space-y-4">
				{#each uploadedImages as img, i (img.id)}
					<div
						data-testid="photo-entry"
						class="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
						transition:fade
					>
						<!-- Thumbnail -->
						<img
							src={img.preview}
							alt={img.name}
							class="w-16 h-16 object-cover rounded"
						/>

						<!-- Copies control -->
						<div class="flex items-center gap-2">
							<button
								data-testid={"qty-minus-" + img.id}
								type="button"
								class="bg-gray-200 px-2 rounded font-bold"
								onclick={() => decreaseCopies(i)}
							>-</button>
							<span class="font-bold w-4 text-center">{img.copies}</span>
							<button
								type="button"
								class="bg-gray-200 px-2 rounded font-bold"
								onclick={() => increaseCopies(i)}
							>+</button>
						</div>

						<!-- File name -->
						<p class="flex-1 truncate">{img.name}</p>

						<!-- Size dropdown -->
						<div class="flex items-center">
							<select
								data-testid={"size-select-" + img.id}
								class="bg-yellow-300 font-semibold rounded-l-lg px-3 py-1 border-r-2 border-black focus:outline-none"
								bind:value={img.size}
								onchange={(e) => changeSize(i, e)}
							>
								<option value="3R">3R</option>
								<option value="4R">4R</option>
								<option value="5R">5R</option>
								<option value="6R">6R</option>
								<option value="7R">7R</option>
								<option value="8R">8R</option>
							</select>
							<div class="bg-yellow-300 rounded-r-lg px-3 py-1 font-semibold">
								₱{img.price.toFixed(2)}
							</div>
						</div>

						<div class="flex items-center gap-3 ml-20">
							<label class="font-semibold" for="fitMode">Print Mode:</label>
							<select
								id="fitMode"
								class="border rounded px-2 py-1 bg-white"
								bind:value={img.fitMode}
								onchange={(e) => changeFitMode(i, e)}
							>

								<option value="crop">Crop to Fit</option>
								<option value="fit">Fit on Page</option>
							</select>
						</div>

						<!-- Delete -->
						<button
							data-testid={"delete-" + img.id}
							class="text-red-500 font-bold text-lg ml-3 hover:text-red-700"
							onclick={() => removeImage(i)}
						>
							🗑
						</button>
					</div>
				{/each}
			</div>

			<div data-testid="total-price" class="text-right font-bold text-xl mt-6">
				TOTAL: ₱{total.toFixed(2)}
			</div>
		</section>
		{/if}
		<div class="mt-4">
			<label class="block font-bold mb-2 text-sm" for="pickupMode">MODE OF DELIVERY FOR PICK-UP*</label>
			<div class="flex flex-col gap-2">
				<label class="text-sm">
					<input
						type="radio"
						id="pickupMode"
						name="pickupMode"
						value="same-day"
						bind:group={pickupMode}
					/> SAME DAY COURIER (LALAMOVE, GRAB, MR. SPEEDY, ETC.)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickupMode"
						value="courier"
						bind:group={pickupMode}
					/> COURIER (JRS, LBC, J&T, GOGOEXPRESS, ETC.)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickupMode"
						value="dropoff"
						bind:group={pickupMode}
					/> DROP-OFF AT LOCATION (ONE10STUDIOLAB, MUNTINLUPA CITY)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickupMode"
						value="other"
						bind:group={pickupMode}
					/>
					OTHER:
					{#if pickupMode === 'other'}
						<input
							type="text"
							class="ml-2 px-2 py-1 rounded border border-gray-300 bg-white inline-block w-40 {fieldErrors.pickupOther
								? 'border-2 border-red-500'
								: ''}"
							placeholder="Specify"
							bind:value={pickupOther}
						/>
						{#if fieldErrors.pickupOther}
							<p class="text-red-500 text-sm mt-1">{fieldErrors.pickupOther}</p>
						{/if}
					{/if}
				</label>
			</div>
			{#if fieldErrors.pickupMode}
				<p class="text-red-500 text-sm mt-1">{fieldErrors.pickupMode}</p>
			{/if}
		</div>
		<div class="flex gap-4 mt-6 items-center" style="cursor: pointer">
			<button 
				type="submit" 
				class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black disabled:opacity-50"
				disabled={!!$user}
				title={$user ? "Staff users cannot add items to cart" : ""}
				>Add to cart</button
			>
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
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center"
			>Register / Log in</a
		>
	</div>
{/if} 
