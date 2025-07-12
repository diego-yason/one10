<script>
	import CartItem from './CartItem.svelte';
	import { onMount } from 'svelte';
	import { user, isStaffUser, authLoaded } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart';
	import { get } from 'svelte/store';
	import { CartService } from '$lib/services/cart';

	let cartItems = [];
	let total = 0;
	let loaded = false;
	let authChecked = false;
	let currentUser = null;
	let isAuthLoaded = false;
	let cartService = CartService.getInstance();

	// Improved client-side route protection with loading state
	onMount(() => {
		user.subscribe(($user) => {
			currentUser = $user;
		});
		authLoaded.subscribe(($authLoaded) => {
			isAuthLoaded = $authLoaded;
			if (isAuthLoaded) {
				if (currentUser && isStaffUser(currentUser)) {
					goto('/');
				}
			}
		});
	});

	function getCartKey(user) {
		return user && user.uid ? `cart-${user.uid}` : 'cart';
	}

	// Watch for user changes and update cart key
	let lastUserId = null;
	$user: {
		if (typeof window !== 'undefined') {
			if (currentUser && currentUser.uid) {
				// Logged in: load cart from Firestore
				cartService.getCart(currentUser.uid).then((items) => {
					cartItems = items;
					loaded = true;
				});
				lastUserId = currentUser.uid;
			} else {
				// Guest: load cart from localStorage
				const stored = localStorage.getItem('cart');
				cartItems = stored ? JSON.parse(stored) : [];
				lastUserId = null;
				loaded = true;
			}
		}
	}

	// Save cart to correct place
	$: if (loaded) {
		if (currentUser && currentUser.uid) {
			cartService.setCart(currentUser.uid, cartItems);
		} else {
			localStorage.setItem('cart', JSON.stringify(cartItems));
		}
	}

	$: total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const unsubscribe = cart.subscribe((items) => {
		cartItems = items;
	});

	function clearCart() {
		cart.clear();
	}

	function updateQuantity(index, quantity) {
		cart.updateQuantity(index, quantity);
	}

	function removeItem(index) {
		cart.remove(index);
	}

	// Optional: clean up subscription if this page is ever destroyed
	// onDestroy(() => unsubscribe());
</script>

<!--Testing Buttons
<button
	on:click={() =>
		addItem({ type: "film", name: "New 16mm Film", quantity: 1, price: 450 })

	}
	class="bg-green-500 text-white px-4 py-2 rounded"
>
	Add Item
</button>

<button
	on:click={() =>
		clearStorage()
	}
	class="bg-green-500 text-white px-4 py-2 rounded"
>
	Clear Storage
</button>
-->

<div class="flex flex-col px-32 py-24 space-y-6">
	<!--Item container-->
	<h2 class="text-gray-800 font-spaceGrotesk text-7xl font-bold text-left w-3/4 mb-auto h-30 mt-10">
		Cart
	</h2>
	{#if cartItems.length === 0}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-lg text-gray-500 mb-4">Your cart is empty.</p>
			<a
				href="/services"
				class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black hover:bg-amber-400 transition"
				>Shop Now</a
			>
		</div>
	{:else}
		{#each cartItems as item, i (item.id + '-' + i)}
			<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 items-center">
				{#if item.imageUrl}
					<div class="cart-image-container">
						<img src={item.imageUrl} alt={item.name} class="cart-image" />
					</div>
				{/if}
				<div class="flex flex-1">
					<div class="flex-col text-left space-y-35">
						<div>
							<h6 class="m-5 font-spaceGrotesk font-bold">
								{item.type === 'product' ? 'Product' : 'Service'}
							</h6>
							<p class="m-5">{item.name}</p>
							{#if item.details}
								{#if item.type === 'service'}
									<div class="m-5 text-xs bg-gray-100 p-2 rounded service-details">
										{#if item.name === 'Disposable Camera' || item.name === '35mm Film' || item.name === '120mm Film'}
											<div><b>Film Brand:</b> {item.details.filmBrand}</div>
											<div><b>Process Type:</b> {item.details.processType}</div>
											<div><b>Returning Negatives:</b> {item.details.returningNegatives}</div>
											<div><b>Scan/Process Option:</b> {item.details.scanOption}</div>
										{:else if item.name === 'Printing'}
											<div><b>Photo Size:</b> {item.details.photoSize}</div>
											<div><b>Total Photos:</b> {item.details.totalPhotos}</div>
											<div><b>Access Photos:</b> {item.details.accessPhotos}</div>
											{#if item.details.linkPhotos}
												<div><b>Link to Photos:</b> {item.details.linkPhotos}</div>
											{/if}
											<div>
												<b>Drop-off:</b>
												{item.details.dropoffMode === 'other'
													? item.details.dropoffOther
													: item.details.dropoffMode}
											</div>
											<div>
												<b>Pick-up:</b>
												{item.details.pickupMode === 'other'
													? item.details.pickupOther
													: item.details.pickupMode}
											</div>
										{:else}
											<div>{JSON.stringify(item.details)}</div>
										{/if}
									</div>
								{:else}
									<pre class="m-5 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(
											item.details,
											null,
											2
										)}</pre>
								{/if}
							{/if}
						</div>
						<div>
							{#if item.type === 'product'}
								<div class="flex border-1 w-32 m-5 rounded-lg justify-around">
									<button
										class="px-1.5 basis-1/4 py-3 border-r-[1px] border-black"
										on:click={() => updateQuantity(i, item.quantity - 1)}
										disabled={item.quantity <= 1}>-</button
									>
									<input
										type="number"
										min="1"
										class="w-12 text-center"
										value={item.quantity}
										on:input={(e) => updateQuantity(i, +e.target.value)}
									/>
									<button
										class="px-1.5 basis-1/4 py-3 border-l-[1px] border-black"
										on:click={() => updateQuantity(i, item.quantity + 1)}>+</button
									>
								</div>
							{:else}
								<span style="display:block; margin-top:0.5rem;">Qty: {item.quantity}</span>
							{/if}
							<h6 class="text-left font-bold" style="margin-top:0.25rem;">
								₱{item.price * item.quantity}
							</h6>
						</div>
					</div>
				</div>
				<button class="ml-8 text-red-600 font-bold" on:click={() => removeItem(i)}>Remove</button>
			</div>
		{/each}
		<div class="flex border-1 rounded-lg my-auto y-100 p-5 text-left font-bold py-15">
			<div>
				<h2>Order Summary</h2>
				<div class="flex space-x-4">
					<h3>Total</h3>
					<h3 class="font-normal">₱{total}</h3>
				</div>
			</div>
			<div class="ml-auto flex gap-4">
				<button
					class="bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
					on:click={clearCart}>Clear Cart</button
				>
				<button
					class="bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
					>Checkout</button
				>
			</div>
		</div>
	{/if}
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

{#if currentUser === null}
	<div class="py-48 flex justify-between px-40 background-color">
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

<style>
	.reminders {
		width: 90rem;
		height: 26.6875rem;
		flex-shrink: 0;
		background: #f2c94c;
	}

	.image {
		width: 29rem;
		height: 26.6875rem;
		flex-shrink: 0;
	}

	.heading-3 {
		color: var(--Global-black, #000);
		/* Headings/h3 */
		font-family: 'Space Grotesk';
		font-size: 1.875rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2.26rem; /* 120.533% */
	}

	.heading-5 {
		width: 12.8125rem;
		height: 2.1875rem;
		flex-shrink: 0;

		color: var(--Global-black, #000);

		/* headings/h5 */
		font-family: 'Space Grotesk';
		font-size: 1.375rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2rem; /* 145.455% */
		letter-spacing: 0.075rem;
	}

	.desc {
		width: 15.25rem;
		height: 10.75rem;
		flex-shrink: 0;
		color: var(--Gray-2, #4f4f4f);

		/* Paragraphs/p-normal */
		font-family: Roboto;
		font-size: 0.9375rem;
		font-style: normal;
		font-weight: 500;
		line-height: 1.3875rem; /* 148% */
		letter-spacing: 0.0375rem;
	}

	.background-color {
		background: var(--Gray-2, #4f4f4f);
	}

	.cart-image-container {
		width: 180px;
		height: 180px;
		background: #fff;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 2rem;
	}
	.cart-image {
		max-width: 140px;
		max-height: 140px;
		object-fit: contain;
		border-radius: 0.5rem;
	}

	.service-details {
		min-width: 320px;
		max-width: 480px;
		width: 60%;
		margin-bottom: 0.5rem;
	}
	.service-details div {
		margin-bottom: 0.25rem;
		font-size: 1rem;
	}
</style>
