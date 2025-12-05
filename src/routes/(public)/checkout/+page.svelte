<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { cart, getTotalPrice, showToast } from '$lib/stores/cart';
	import type { PageProps } from './$types';
	import { getImage, clearImages, clearFormState } from '$lib/db/cartImages';
	import { onMount } from 'svelte';
	import ImageGalleryModal from '$public/cart/ImageGalleryModal.svelte';
	import type { imgMeta } from '$public/store/printing/schema';
	import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

	let email = $state('');
	let fullName = $state('');
	let address = $state('');
	let city = $state('');
	let province = $state('');
	let zip = $state('');
	let phone = $state('');

	let errors = {};
	let touched = {};

	let disabled = $state(false);

	let { data, form }: PageProps = $props();

	interface ImageData {
		url: string;
		name: string;
		size?: string;
		copies?: number;
	}

	// Modal state
	let showModal = $state(false);
	let currentCartItemImages: ImageData[] = $state([]);

	// Store all loaded images for each cart item
	let cartItemImages = $state<Map<number, ImageData[]>>(new Map());

	// Create a promise that loads all images (first image of each print item for thumbnails)
	const photoPrints = $cart.filter((item) => item.details.type === 'print');
	const firstImages = photoPrints
		.map((img) => {
			const images = img.details.uploadedImages as imgMeta[];
			return images?.[0];
		})
		.filter(Boolean); // Remove any undefined values

	const loadedImagesPromise = Promise.all(
		firstImages.map(async (img) => {
			let url;
			const file = await getImage(img.id as string);
			if (file) url = URL.createObjectURL(file);
			return {
				url: url || '',
				name: img.name as string
			};
		})
	);

	// Load all images for a cart item when gallery is opened
	async function loadAllImagesForItem(item: any) {
		const images = item.details.uploadedImages as imgMeta[];
		const loadedImages = await Promise.all(
			images.map(async (img: any) => {
				const file = await getImage(img.id as string);
				const url = file ? URL.createObjectURL(file) : '';
				return {
					url,
					name: img.name as string,
					size: img.size as string,
					copies: img.copies as number
				};
			})
		);
		return loadedImages.filter((img) => img.url);
	}

	async function openGallery(cartIndex: number) {
		const item = $cart[cartIndex];
		if (item.details.type !== 'print') return;

		// Check if we already loaded images for this item
		if (!cartItemImages.has(cartIndex)) {
			const images = await loadAllImagesForItem(item);
			cartItemImages.set(cartIndex, images);
			cartItemImages = cartItemImages; // trigger reactivity
		}

		currentCartItemImages = cartItemImages.get(cartIndex) || [];
		showModal = true;
	}

	// Alternative implementation using onMount if needed:
	// onMount(async () => {
	// 	const photoPrints = $cart.filter((item) => item.details.type === "print");
	// 	const firstImages = photoPrints.map((img) => (img.details.uploadedImage as imgMeta[])[0]);

	// 	// Load all images and store in state
	// 	const images = await Promise.all(
	// 		firstImages.map(async (img) => {
	// 			let url;

	// 			const file =await getImage(img.id as string);
	// 			if (file) url = URL.createObjectURL(file);
	// 			return {
	// 				image: url || "",
	// 				name: img.name as string
	// 			}
	// 		})
	// 	);

	// 	loadedImages = images;
	// 	isLoadingImages = false;
	// });

	let uploadingFlag = $state(false);
	const storage = getStorage();
	// upload images
	uploadingFlag = true;
	const promises: Promise<void>[] = photoPrints.map(
		(item) =>
			new Promise(async (resolveRoot, rejectRoot) => {
				const urls = await loadAllImagesForItem(item);
				const images = item.details.uploadedImages as imgMeta[];

				await Promise.all(
					urls.map(
						(data, index) =>
							new Promise<void>(async (resolve, reject) => {
								const { id: uuid } = images[index];
								const uploadRef = ref(storage, `photo_print_orders/${uuid}`);
								if (await getDownloadURL(uploadRef).catch(() => false)) resolve();

								uploadBytes(uploadRef, await fetch(data.url).then((res) => res.blob()))
									.then(() => {
										resolve();
									})
									.catch((msg) => {
										reject(msg);
									});
							})
					)
				).catch((msg) => {
					rejectRoot(msg);
				});
				resolveRoot();
			})
	);

	Promise.all(promises)
		.then(() => {
			uploadingFlag = false;
		})
		.catch((err) => {
			console.error('Error uploading images:', err);
			showToast('Error uploading images. Please reload this page.');
		});

	for (const item of $cart.filter((item) => item?.details?.type === 'print')) {
		if (item.details.uuid) continue;

		// generate uuid for each print item
		const uuid = crypto.randomUUID();
		const uploadRef = ref(storage, `photo_print_orders/${uuid}`);

		promises.push(
			new Promise((resolve, reject) =>
				uploadBytes(uploadRef, new Blob())
					.then(() => {
						item.details.uuid = uuid;
						resolve();
					})
					.catch((msg) => reject(msg))
			)
		);
	}
	Promise.all(promises)
		.then(() => {
			uploadingFlag = false;
		})
		.catch((err) => {
			console.error('Error uploading images:', err);
			showToast('Error uploading images. Please reload this page.');
		});
</script>

<svelte:head>
	<title>Checkout | One10 Studio Labs</title>
</svelte:head>

<form
	method="POST"
	action="?/create"
	use:enhance={async () => {
		disabled = true;

		return async ({ result }) => {
			// Upload photos to firebase
			disabled = false;
			console.log(result);

			// TODO: remove this (for testing only)
			await clearImages();
			await clearFormState();
			if (result.type === 'success') {
				await clearImages();
				await clearFormState();
				cart.set([]);
				window.location.href = result.data?.redirectUrl as string;
			}
		};
	}}
	class="flex py-10 justify-evenly"
>
	<input type="hidden" name="cart" value={JSON.stringify($cart)} />
	<div class="flex flex-col">
		<div class="flex flex-col space-y-11">
			<h1 class="header-1">Checkout</h1>

			<h2 class="header-2 py-4">Shipping details</h2>

			<div class="flex flex-col space-y-10">
				<div>
					<label for="email" class="labels">Email address</label>
					<input
						type="email"
						bind:value={email}
						placeholder="Please enter your email"
						class="bg-white border-red-500 p-3 text-gray-800 w-full"
						class:border-2={form?.issues?.['email']}
						name="email"
						id="email"
					/>
					{#if form?.issues?.['email']}
						<p class="text-red-500 text-sm mt-1">{form.issues['email']}</p>
					{/if}
				</div>

				<div>
					<label for="name" class="labels">Full name</label>
					<input
						id="name"
						name="fullName"
						type="text"
						bind:value={fullName}
						placeholder="Full name"
						class="bg-white p-3 text-gray-800 border-red-500 w-full"
						class:border-2={form?.issues?.['fullName']}
					/>
					{#if form?.issues?.['fullName']}
						<p class="text-red-500 text-sm mt-1">{form.issues['fullName']}</p>
					{/if}
				</div>

				<div>
					<label for="address" class="labels">Street Address and Barangay</label>
					<input
						type="text"
						id="address"
						name="address"
						bind:value={address}
						placeholder="Address"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['address']}
					/>
					{#if form?.issues?.['address']}
						<p class="text-red-500 text-sm mt-1">{form.issues['address']}</p>
					{/if}
				</div>

				<div>
					<label for="city" class="labels">City</label>
					<input
						type="text"
						name="city"
						bind:value={city}
						placeholder="City"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['city']}
					/>
					{#if form?.issues?.['city']}
						<p class="text-red-500 text-sm mt-1">{form.issues['city']}</p>
					{/if}
				</div>

				<div>
					<label for="province" class="labels">Province</label>
					<input
						type="text"
						name="province"
						bind:value={province}
						placeholder="Province"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['province']}
					/>
					{#if form?.issues?.['province']}
						<p class="text-red-500 text-sm mt-1">{form.issues['province']}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="zip" class="labels">ZIP Code</label>
					<input
						type="text"
						bind:value={zip}
						name="zip"
						id="zip"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['zip']}
					/>
					{#if form?.issues?.['zip']}
						<p class="text-red-500 text-sm mt-1">{form.issues['zip']}</p>
					{/if}
				</div>
				<div>
					<label for="phone" class="labels">Phone</label>
					<input
						type="text"
						bind:value={phone}
						name="phone"
						id="phone"
						class="bg-white p-3 text-gray-800 w-full border-red-500"
						class:border-2={form?.issues?.['phone']}
					/>
					{#if form?.issues?.['phone']}
						<p class="text-red-500 text-sm mt-1">{form.issues['phone']}</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="py-8">
			<button
				disabled={disabled || uploadingFlag}
				class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors px-8"
				type="submit"
			>
				Confirm order
			</button>
			{#if uploadingFlag}
				<span class="ml-4 text-brand font-bold italic">Uploading images, please wait...</span>
			{/if}
		</div>
	</div>

	<div class="w-lg rounded-2xl h-min bg-[#d9d9d9]">
		<div class="flex flex-col py-8 px-5 space-y-3">
			<h1 class="font-spaceGrotesk font-bold py-3 uppercase">Order Summary</h1>
			{#await loadedImagesPromise}
				<!-- Loading state for all images -->
				{#each $cart as item}
					{#if item.details.type === 'print'}
						<div class="flex gap-4 items-center px-4 w-full">
							<div class="flex-1 max-w-[100px] h-[100px] bg-gray-300 animate-pulse rounded"></div>
							<div class="flex flex-col space-y-3 flex-[2]">
								{#each item.details.uploadedImages as imgMeta[] as img}
									<p class="font-openSans font-bold">{img.name}</p>
									<div class="flex justify-between">
										<div>
											{img.copies} × {img.size}
										</div>
										<div class="font-semibold">
											P{(Number(img.copies) * Number(img.price)).toFixed(2)}
										</div>
									</div>
								{/each}
								<p class="Qty">QTY: {item.quantity}</p>
							</div>
							<p class="self-end flex-1 text-right">P{getTotalPrice(item).toLocaleString()}</p>
						</div>
					{:else}
						<div class="flex gap-4 items-center px-4 w-full">
							<img
								src={item.imageUrl}
								class="flex-1 max-w-[100px] h-auto object-contain self-start"
								alt={item.name}
							/>
							<div class="flex flex-col space-y-3 flex-[2]">
								<p class="font-openSans font-bold">{item.name}</p>
								<p class="Qty">QTY: {item.quantity}</p>
							</div>
							<p class="self-end flex-1 text-right">P{getTotalPrice(item).toLocaleString()}</p>
						</div>
					{/if}
				{/each}
			{:then loadedImages}
				<!-- Images loaded successfully -->
				{#each $cart as item, index}
					{@const printItemIndex = $cart
						.slice(0, index)
						.filter((i) => i.details.type === 'print').length}
					{#if item.details.type === 'print'}
						<div class="flex gap-4 items-center px-4 w-full">
							<!-- Clickable image with stacked effect -->
							<button
								type="button"
								class="relative flex-1 max-w-[100px] aspect-square group cursor-pointer"
								onclick={() => openGallery(index)}
								aria-label="View all photos"
							>
								<img
									src={loadedImages[printItemIndex]?.url || ''}
									class="w-full h-full object-cover rounded transition-transform group-hover:scale-105 relative z-10 shadow-md"
									alt={loadedImages[printItemIndex]?.name || ''}
								/>

								<!-- Stacked effect for multiple images -->
								{#if (item.details.uploadedImages as imgMeta[]).length > 1}
									<div
										class="absolute inset-0 bg-white rounded shadow-sm -rotate-3 z-0 transition-transform group-hover:-rotate-6"
									></div>
									<div
										class="absolute inset-0 bg-white rounded shadow-xs -rotate-6 -z-10 transition-transform group-hover:-rotate-9"
									></div>

									<!-- Badge showing count -->
									<div
										class="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full z-20"
									>
										{(item.details.uploadedImages as imgMeta[]).length}
									</div>
								{/if}

								<!-- Hover overlay -->
								<div
									class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded z-20 flex items-center justify-center"
								>
									<svg
										class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
										/>
									</svg>
								</div>
							</button>

							<div class="flex flex-col space-y-3 flex-[2]">
								{#each item.details.uploadedImages as imgMeta[] as img}
									<p class="font-openSans font-bold">{img.name}</p>
									<div class="flex justify-between">
										<div>
											{img.copies} × {img.size}
										</div>
										<div class="font-semibold">
											P{(Number(img.copies) * Number(img.price)).toFixed(2)}
										</div>
									</div>
								{/each}
								<p class="Qty">QTY: {item.quantity}</p>
							</div>
							<p class="self-end flex-1 text-right">
								P{getTotalPrice(item).toFixed(2).toLocaleString()}
							</p>
						</div>
					{:else}
						<div class="flex gap-4 items-center px-4 w-full">
							<img
								src={item.imageUrl}
								class="flex-1 max-w-[100px] h-auto object-contain self-start"
								alt={item.name}
							/>
							<div class="flex flex-col space-y-3 flex-[2]">
								<p class="font-openSans font-bold">{item.name}</p>
								<p class="Qty">QTY: {item.quantity}</p>
							</div>
							<p class="self-end flex-1 text-right">
								P{getTotalPrice(item).toFixed(2).toLocaleString()}
							</p>
						</div>
					{/if}
				{/each}
			{/await}

			<div class="flex justify-between pt-15">
				<h1 class="total">Total</h1>
				<p class="total">
					P{$cart
						.reduce((total, item) => total + getTotalPrice(item), 0)
						.toFixed(2)
						.toLocaleString()}
				</p>
			</div>
			<p class="italic">
				Price does not include any shipping costs. Shipping costs are paid by the customer.
			</p>
		</div>
	</div>
</form>

<!-- Image Gallery Modal -->
<ImageGalleryModal bind:showModal images={currentCartItemImages} />

<style>
	.total {
		color: var(--Global-black, #000);
		font-family: 'Open Sans';
		font-size: 1.5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 0.9rem;
		text-transform: uppercase;
	}
	.header-1 {
		color: var(--Gray-1, #333);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: var(--Gray-1, #333);
		font-family: 'Space Grotesk';
		font-size: 5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 5.5rem;
		letter-spacing: -0.1rem;
	}

	.header-2 {
		color: var(--Global-black, #000);
		font-family: 'Space Grotesk';
		font-size: 2.375rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2.925rem;
	}

	.labels {
		color: var(--Global-black, #000);
		font-family: 'Open Sans';
		font-size: 0.875rem;
		font-style: normal;
		font-weight: 700;
		line-height: 0.9rem;
		text-transform: uppercase;
	}
</style>
