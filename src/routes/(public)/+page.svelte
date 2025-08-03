<script lang="ts">
	import { products, loading, error } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import { loadProducts } from '$lib/stores/products';
	import { user, isStaff } from '$lib/stores/auth';
	import { z } from 'zod';
	import { validateField } from '$lib/validation';

	import { navHeight } from './+layout.svelte';

	let container: HTMLElement;
	let bg: HTMLElement;
	let hero: HTMLElement;
	onMount(() => {
		loadProducts();
		navHeight.subscribe((height) => {
			bg.style.setProperty('top', `-${height}px`);
			hero.style.setProperty('top', `calc(-${height}px + 57%)`);
			container.style.setProperty('height', `calc(100vh - ${height}px)`);
		});
	});

	// Get the first 3 products for display
	$: homeProducts = $products.slice(0, 3);

	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let formSuccess = false;
	let errorMessages: string[] = [];
	let fieldErrors: Record<string, string> = {};

	const contactSchema = z.object({
		name: z.string().min(1, 'Name is required.'),
		email: z.string().email('Please enter a valid email address.'),
		subject: z.string().min(1, 'Subject is required.'),
		message: z.string().min(1, 'Message is required.')
	});

	function handleFieldChange(field: string, value: string) {
		if (errorMessages.length > 0) errorMessages = [];
		const error = validateField(contactSchema, field as keyof typeof contactSchema.shape, value);
		if (error) {
			fieldErrors = { ...fieldErrors, [field]: error };
		} else {
			const { [field]: _, ...rest } = fieldErrors;
			fieldErrors = rest;
		}
	}

	function handleSubmit(e: Event) {
		e?.preventDefault?.();
		errorMessages = [];
		fieldErrors = {};
		const result = contactSchema.safeParse({ name, email, subject, message });
		if (!result.success) {
			if (result.error && Array.isArray(result.error.errors)) {
				result.error.errors.forEach((error) => {
					const field = error.path[0] as string;
					fieldErrors[field] = error.message;
				});
			} else {
				errorMessages = ['Invalid input.'];
			}
			return;
		}
		const mailto = `mailto:contact@one10studiolab.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
		window.location.href = mailto;
		name = '';
		email = '';
		subject = '';
		message = '';
	}

	import logo from '$lib/imgs/logo/white.png';
	import background1 from '$lib/imgs/backgrounds/img51.jpg';
	import background2 from '$lib/imgs/backgrounds/img22.jpg';
	import background3 from '$lib/imgs/backgrounds/img9.jpg';
	import background4 from '$lib/imgs/backgrounds/img16.jpg';
	import film from '$lib/imgs/icons/film.svg';
	import prints from '$lib/imgs/icons/photoPrints.svg';
	import studio from '$lib/imgs/icons/cameraIndoor.svg';
</script>

<div class="relative min-h-[700px] h-[781px]" bind:this={container}>
	<div class="absolute inset-0 z-0 brightness-50 -top-[130px]" bind:this={bg}>
		<img src={background1} alt="Background" class="w-full h-full object-cover" />
	</div>
	<div
		class="flex flex-col items-center justify-center text-center z-10 relative
	top-[325px] -translate-y-1/2 left-1/2 -translate-x-1/2"
		bind:this={hero}
	>
		<span
			class="text-4xl flex items-end gap-2 font-spaceGrotesk line font-bold leading-none text-white"
		>
			<img src={logo} class="w-[60px] inline object-contain" alt="logo" />
			<p><span class="textOutline text-transparent">Studio</span> Lab</p>
		</span>
		<h1 class="font-bold font-spaceGrotesk text-7xl text-white mt-4">We process your vision</h1>
	</div>
</div>
<div class="px-40 bg-gray-800 py-20">
	<div class="max-w-screen-xl w-full mx-auto">
		<div class="flex flex-row justify-around gap-40 mb-28">
			<div class="grow">
				<h2 class="text-amber-300 uppercase font-spaceGrotesk text-sm">
					<span class="tracking-[-0.2em]">——————————</span> Our Mission
				</h2>
				<p class="font-spaceGrotesk text-4xl text-white font-bold">
					Photography leads us to more interpretations of reality.
				</p>
			</div>
			<p class="font-roboto text-white basis-1/2">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam perspiciatis natus
				eaque, suscipit, repellendus quos ad minus perferendis laborum praesentium repellat
				necessitatibus ut accusantium consequuntur consequatur facere. Magni, voluptatem voluptatum?
			</p>
		</div>
		<div class="flex gap-24">
			<div class="basis-1/3">
				<img src={film} alt="" class="mb-8 h-[72px] aspect-square rotate-90" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Develop + Scan</p>
				<p class="mt-5 mb-8 text-white">
					Get your film processed and scanned with care, ready for digital archiving.
				</p>
				<a href="/store" class="bg-amber-300 rounded-4xl px-6 py-2">Let us process your film</a>
			</div>
			<div class="basis-1/3">
				<img src={prints} alt="" class="mb-8 h-[72px] aspect-square" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Printing</p>
				<p class="mt-5 mb-8 text-white">
					Bring your images to life with high-quality prints made for lasting memories.
				</p>
				<p class="text-amber-300">Coming soon</p>
				<!-- <a href="/store" class="bg-amber-300 rounded-4xl px-6 py-2">Print your work</a> -->
			</div>
			<div class="basis-1/3">
				<img src={studio} alt="" class="mb-8 h-[72px] aspect-square" />
				<p class="font-spaceGrotesk text-2xl text-white font-bold">Studio Rental</p>
				<p class="mt-5 mb-8 text-white">
					A private creative space; perfect for portrait sessions, product shoots, and creative
					projects. Flexible rental options for both pros and hobbyists, right here in Muntinlupa
					City.
				</p>
				<p class="text-amber-300">Coming soon</p>
				<!-- <a href="" class="bg-amber-300 rounded-4xl px-6 py-2">Book your shoot</a> -->
			</div>
		</div>
	</div>
</div>
<div class="py-24 relative bg-transparent">
	<div class="absolute inset-0 z-0 brightness-50">
		<img src={background4} alt="" class="w-full h-full object-cover" />
	</div>
	<h2 class="text-center text-white z-10 relative font-spaceGrotesk text-4xl font-bold mb-20">
		Need some fresh rolls?
	</h2>
	<div class="max-w-6xl mx-auto relative z-10 w-full">
		{#if $loading}
			<div class="flex justify-center items-center py-20">
				<p class="text-lg">Loading products...</p>
			</div>
		{:else if $error}
			<div class="flex justify-center items-center py-20">
				<p class="text-lg text-red-600">Error loading products: {$error}</p>
			</div>
		{:else if homeProducts.length === 0}
			<div class="flex gap-10 justify-center mb-16">
				<div
					class="px-5 py-2.5 items-center self-stretch bg-white rounded-2xl flex flex-col relative shadow-lg min-w-[260px] max-w-[340px]"
				>
					<div class="image-2 flex items-center justify-center relative">
						<img src="https://placehold.co/350x250" alt="" class="product-img" />
					</div>
					<div class="flex flex-col flex-1 justify-between items-center py-10 w-full min-h-[160px]">
						<div class="w-full">
							<p class="product-2-description text-center">Films</p>
							<p class="product-2-font text-center truncate-name">No products available</p>
						</div>
						<div class="w-full flex flex-col items-center mt-4">
							<div class="rounded-full border border-gray-300 px-8 py-2 mt-4">Out of Stock</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-wrap justify-start gap-x-30 gap-y-10 py-10">
				{#each homeProducts as product}
					<div
						class="px-5 py-2.5 items-center self-stretch bg-white rounded-2xl
						flex flex-col relative shadow-lg min-w-[260px] max-w-[340px] mx-4"
					>
						<div class="image-2 flex items-center justify-center relative">
							<a href={`/product/${product.id}`}>
								{#if product.imageUrl}
									<img src={product.imageUrl} alt={product.name} class="product-img" />
								{:else}
									<img src="https://placehold.co/350x250" alt="" class="product-img" />
								{/if}
							</a>
							{#if product.status !== 'available'}
								<span
									class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded z-10"
								>
									Sold Out
								</span>
							{/if}
						</div>
						<div
							class="flex flex-col flex-1 justify-between items-center py-10 w-full min-h-[160px]"
						>
							<div class="w-full">
								<p class="product-2-description text-center">{product.category}</p>
								<p class="product-2-font text-center truncate-name">
									<a href={`/product/${product.id}`} class="hover:text-amber-400">{product.name}</a>
								</p>
							</div>
							<div class="w-full flex flex-col items-center mt-4">
								<p class="text-sm text-gray-600 mt-2">₱{product.price}</p>
								<p class="text-xs text-gray-500 mt-1">Stock: {product.stock || 0}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<a
			href="/store"
			class="bg-amber-300 px-6 py-2 rounded-full block w-min whitespace-nowrap mx-auto mt-8"
		>
			View all
		</a>
	</div>
</div>
<div class="relative text-center py-24 bg-gray-300">
	<div class="absolute inset-0 grayscale z-0">
		<img src={background3} alt="Background" class="w-full h-full object-cover" />
	</div>
	<h2 class="font-spaceGrotesk font-bold text-4xl relative text-white z-10 mb-6">
		Got some questions?
	</h2>
	<a href="/faq" class="bg-amber-400 relative z-10 rounded-4xl px-6 py-2">Read our FAQs</a>
</div>

<!-- {#if !$user}
	<div class="py-32 px-40 flex flex-row items-center justify-between">
		<div class="flex flex-col justify-center" style="min-width: 480px;">
			<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-2">
				<span class="block textOutline text-transparent">Sign up</span> and save
			</h2>
			<p class="text-white font-roboto text-lg">Register and Subscribe to get special offers</p>
		</div>
		<div class="flex items-center">
			<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-8 py-3 text-base"
				>Register / Log in</a
			>
		</div>
	</div>
{/if} -->
<!-- <div class="py-24 bg-gray-100">
	<h2 class="text-center font-spaceGrotesk text-4xl font-bold mb-12">Contact Us</h2>
	<div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10">
		{#if formSuccess}
			<div
				class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center"
			>
				Thank you for reaching out! We'll get back to you soon.
			</div>
		{:else}
			<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
				{#if errorMessages.length}
					<div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
						<ul>
							{#each errorMessages as errMsg}
								<li>{errMsg}</li>
							{/each}
						</ul>
					</div>
				{/if}
				<div>
					<label for="name" class="block mb-2 font-bold">Name</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300 {fieldErrors.name
							? 'border-2 border-red-500'
							: ''}"
						placeholder="Your Name"
						on:input={(e) => handleFieldChange('name', e.currentTarget.value)}
					/>
					{#if fieldErrors.name}
						<p class="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
					{/if}
				</div>
				<div>
					<label for="email" class="block mb-2 font-bold">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300 {fieldErrors.email
							? 'border-2 border-red-500'
							: ''}"
						placeholder="you@email.com"
						on:input={(e) => handleFieldChange('email', e.currentTarget.value)}
					/>
					{#if fieldErrors.email}
						<p class="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
					{/if}
				</div>
				<div>
					<label for="subject" class="block mb-2 font-bold">Subject</label>
					<input
						id="subject"
						type="text"
						bind:value={subject}
						class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300 {fieldErrors.subject
							? 'border-2 border-red-500'
							: ''}"
						placeholder="Subject"
						on:input={(e) => handleFieldChange('subject', e.currentTarget.value)}
					/>
					{#if fieldErrors.subject}
						<p class="text-red-500 text-sm mt-1">{fieldErrors.subject}</p>
					{/if}
				</div>
				<div>
					<label for="message" class="block mb-2 font-bold">Message</label>
					<textarea
						id="message"
						bind:value={message}
						rows="5"
						class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300 {fieldErrors.message
							? 'border-2 border-red-500'
							: ''}"
						placeholder="How can we help you?"
						on:input={(e) => handleFieldChange('message', e.currentTarget.value)}
					></textarea>
					{#if fieldErrors.message}
						<p class="text-red-500 text-sm mt-1">{fieldErrors.message}</p>
					{/if}
				</div>
				<button
					type="submit"
					class="bg-amber-300 text-black font-bold py-3 rounded-4xl hover:bg-amber-400 transition-colors mt-2"
					>Send Message</button
				>
			</form>
		{/if}
	</div>
</div> -->

<style>
	.image-2 {
		height: 120px;
		width: 180px;
		background-color: #fafafa;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #fafafa;
		display: block;
	}

	.product-2-font {
		color: var(--Global-black, #000);
		font-family: 'Space Grotesk';
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: 24px;
		letter-spacing: 1px;
	}

	.product-2-description {
		color: var(--Gray-5, #e0e0e0);
		font-family: 'Space Grotesk';
		font-size: 10px;
		font-style: normal;
		font-weight: 600;
		line-height: 16px;
		text-transform: uppercase;
	}

	.truncate-name {
		max-width: 180px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 auto;
	}
</style>
