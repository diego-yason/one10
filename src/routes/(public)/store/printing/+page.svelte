<!-- Temporary Form Fields -->
<script lang="ts">
	import { user, isStaff } from '$lib/stores/auth';
	import { printingSchema, validateField } from '$lib/validation';
	import { cart, showToast, add } from '$lib/stores/cart';
	import background from "$lib/imgs/backgrounds/img9.jpg";
	import { fade } from "svelte/transition";

	let pickupMode = '';
	let pickupOther = '';

	let uploadedImages: {
		id: number;
		file: File;
		name: string;
		preview: string;
		copies: number;
		size: string;
		price: number;
	}[] = $state([]);

	let errorMessages: string[] = [];

	let fieldErrors: Record<string, string> = {};

	let total = $state(0);
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
						price: 100 // placeholder
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

	function updateTotal() {
		total = uploadedImages.reduce(
			(sum, img) => sum + img.copies * img.price,
			0
		);
	}

	// Real-time validation function
	function handleFieldChange(field: string, value: string) {
		// if (errorMessages.length > 0) {
		// 	errorMessages = [];
		// }

		// if (['dropoffOther', 'pickupOther', 'dropoffMode', 'pickupMode'].includes(field)) {
		// 	const result = printingSchema.safeParse({
		// 		photoSize,
		// 		totalPhotos,
		// 		accessPhotos,
		// 		linkPhotos,
		// 		dropoffMode: field === 'dropoffMode' ? value : dropoffMode,
		// 		dropoffOther: field === 'dropoffOther' ? value : dropoffOther,
		// 		pickupMode: field === 'pickupMode' ? value : pickupMode,
		// 		pickupOther: field === 'pickupOther' ? value : pickupOther
		// 	});
		// 	let errors: Record<string, string> = {};
		// 	if (!result.success) {
		// 		result.error.errors.forEach((error) => {
		// 			const f = error.path[0] as string;
		// 			errors[f] = error.message;
		// 		});
		// 	}
		// 	fieldErrors = { ...fieldErrors, ...errors };
		// 	if (value) {
		// 		const { [field]: _, ...rest } = fieldErrors;
		// 		fieldErrors = rest;
		// 	}
		// 	return;
		// }

		// const error = validateField(printingSchema, field as keyof typeof printingSchema.shape, value);
		// if (error) {
		// 	fieldErrors = { ...fieldErrors, [field]: error };
		// } else {
		// 	const { [field]: _, ...rest } = fieldErrors;
		// 	fieldErrors = rest;
		// }
	}

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		errorMessages = [];
		fieldErrors = {};

		// const result = printingSchema.safeParse({
		// 	photoSize,
		// 	totalPhotos,
		// 	accessPhotos,
		// 	linkPhotos,
		// 	dropoffMode,
		// 	dropoffOther,
		// 	pickupMode,
		// 	pickupOther
		// });

		// if (!result.success) {
		// 	if (result.error && Array.isArray(result.error.errors)) {
		// 		result.error.errors.forEach((error) => {
		// 			const field = error.path[0] as string;
		// 			fieldErrors[field] = error.message;
		// 		});
		// 	} else {
		// 		errorMessages = ['Please fill in all required fields.'];
		// 	}
		// 	return;
		// }

		// const qty = parseInt(totalPhotos) || 1;
		// add({
		// 	id: 'printing',
		// 	name: 'Printing',
		// 	price: 8 * qty,
		// 	quantity: 1,
		// 	details: result.data,
		// 	imageUrl: 'https://placehold.co/350x250'
		// });
		// showToast('Added to cart!');
	};
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

	<form on:submit={handleSubmit} class="w-full flex flex-col gap-6">
	<!-- Upload field -->
		<div>
			<label class="block font-bold mb-2 text-sm" for="upload">UPLOAD YOUR PHOTOS*</label>
			<input
				type="file"
				id="upload"
				multiple
				on:change={handleFileUpload}
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
								type="button"
								class="bg-gray-200 px-2 rounded font-bold"
								on:click={() => decreaseCopies(i)}
							>-</button>
							<span class="font-bold w-4 text-center">{img.copies}</span>
							<button
								type="button"
								class="bg-gray-200 px-2 rounded font-bold"
								on:click={() => increaseCopies(i)}
							>+</button>
						</div>

						<!-- File name -->
						<p class="flex-1 truncate">{img.name}</p>

						<!-- Size dropdown -->
						<div class="flex items-center">
							<select
								class="bg-yellow-300 font-semibold rounded-l-lg px-3 py-1 border-r-2 border-black focus:outline-none"
								bind:value={img.size}
								on:change={(e) => changeSize(i, e)}
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

						<!-- Delete -->
						<button
							class="text-red-500 font-bold text-lg ml-3 hover:text-red-700"
							on:click={() => removeImage(i)}
						>
							🗑
						</button>
					</div>
				{/each}
			</div>

			<div class="text-right font-bold text-xl mt-6">
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
						name="pickup"
						value="same-day"
						bind:group={pickupMode}
						on:change={(e) => {
							handleFieldChange('pickupMode', e.currentTarget.value);
							pickupOther = '';
						}}
					/> SAME DAY COURIER (LALAMOVE, GRAB, MR. SPEEDY, ETC.)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickup"
						value="courier"
						bind:group={pickupMode}
						on:change={(e) => {
							handleFieldChange('pickupMode', e.currentTarget.value);
							pickupOther = '';
						}}
					/> COURIER (JRS, LBC, J&T, GOGOEXPRESS, ETC.)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickup"
						value="dropoff"
						bind:group={pickupMode}
						on:change={(e) => {
							handleFieldChange('pickupMode', e.currentTarget.value);
							pickupOther = '';
						}}
					/> DROP-OFF AT LOCATION (ONE10STUDIOLAB, MUNTINLUPA CITY)
				</label>
				<label class="text-sm">
					<input
						type="radio"
						name="pickup"
						value="other"
						bind:group={pickupMode}
						on:change={(e) => handleFieldChange('pickupMode', e.currentTarget.value)}
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
							on:input={(e) => handleFieldChange('pickupOther', e.currentTarget.value)}
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
		<div class="flex gap-4 mt-6 items-center">
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
