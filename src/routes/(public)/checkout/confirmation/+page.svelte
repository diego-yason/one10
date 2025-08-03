<svelte:head>
	<title>Payment Confirmation | One10 Studio Labs</title>
</svelte:head>

<div class="flex flex-col h-[100rem]">
	<div class="flex flex-col space-y-11">
		<h1 class="header-1 px-32 py-8">Checkout</h1>

		{#if status === 'PAYMENT_SUCCESS'}
			<div class="flex flex-col items-center justify-center space-y-10">
				<div class="flex flex-col items-center space-y-5">
					<div class="flex w-18 h-18 bg-green-500 rounded-full"></div>
					<h2 class="header-2">Payment completed</h2>
				</div>

				<div class="confirmation bg-white flex flex-col">
					<div class="transaction px-10 py-10">Transaction details</div>
					<hr class="">
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Date</p>
						<p class="font-details">8/3/2025</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Payment method</p>
						<p class="font-details">Google play</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Total</p>
						<p class="font-details">P250</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Email</p>
						<p class="email">JuanDELACRUZ@gmaIl.com</p>
					</div>
					<hr>
				</div>
				<button class="proceed hover:cursor-pointer hover:shadow-lg">View Invoice</button>
			</div>
		{:else if status === 'PAYMENT_FAILED'}
			<div class="flex flex-col items-center justify-center space-y-10">
				<div class="flex flex-col items-center space-y-5">
					<div class="flex w-18 h-18 bg-red-500 rounded-full"></div>
					<h2 class="header-2">Payment failed</h2>
				</div>

				<div class="confirmation bg-white flex flex-col">
					<div class="transaction px-10 py-10">Transaction details</div>
					<hr class="">
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Date</p>
						<p class="font-details">8/3/2025</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Payment method</p>
						<p class="font-details">Google play</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Total</p>
						<p class="font-details">P250</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Email</p>
						<p class="email">JuanDELACRUZ@gmaIl.com</p>
					</div>
					<hr>
				</div>
				<button class="proceed hover:cursor-pointer hover:shadow-lg">View Invoice</button>
			</div>
		{:else if status === 'PAYMENT_PENDING'}
			<div class="flex flex-col items-center justify-center space-y-10">
				<div class="flex flex-col items-center space-y-5">
					<div class="flex w-18 h-18 bg-orange-500 rounded-full"></div>
					<h2 class="header-2">Confirming payment</h2>
				</div>

				<div class="confirmation bg-white flex flex-col">
					<div class="transaction px-10 py-10">Transaction details</div>
					<hr class="">
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Date</p>
						<p class="font-details">8/3/2025</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Payment method</p>
						<p class="font-details">Google play</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Total</p>
						<p class="font-details">P250</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Email</p>
						<p class="email">JuanDELACRUZ@gmaIl.com</p>
					</div>
					<hr>
				</div>
				<button class="proceed hover:cursor-pointer hover:shadow-lg">View Invoice</button>
			</div>
		{:else if status === 'PAYMENT_CANCELLED'}
			<div class="flex flex-col items-center justify-center space-y-10">
				<div class="flex flex-col items-center space-y-5">
					<div class="flex w-18 h-18 bg-red-500 rounded-full"></div>
					<h2 class="header-2">Payment cancelled</h2>
				</div>

				<div class="confirmation bg-white flex flex-col">
					<div class="transaction px-10 py-10">Transaction details</div>
					<hr class="">
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Date</p>
						<p class="font-details">8/3/2025</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Payment method</p>
						<p class="font-details">Google play</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Total</p>
						<p class="font-details">P250</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Email</p>
						<p class="email">JuanDELACRUZ@gmaIl.com</p>
					</div>
					<hr>
				</div>
				<button class="proceed hover:cursor-pointer hover:shadow-lg">View Invoice</button>
			</div>
		{:else if status === 'PAYMENT_EXPIRED'}
			<div class="flex flex-col items-center justify-center space-y-10">
				<div class="flex flex-col items-center space-y-5">
					<div class="flex w-18 h-18 bg-red-500 rounded-full"></div>
					<h2 class="header-2">Payment expired</h2>
				</div>

				<div class="confirmation bg-white flex flex-col">
					<div class="transaction px-10 py-10">Transaction details</div>
					<hr class="">
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Date</p>
						<p class="font-details">8/3/2025</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Payment method</p>
						<p class="font-details">Google play</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Total</p>
						<p class="font-details">P250</p>
					</div>
					<hr>
					<div class="flex flex-row px-20 py-10 justify-between">
						<p class="font-details">Email</p>
						<p class="email">Juandelacruz@gmaIl.com</p>
					</div>
					<hr>
				</div>
				<button class="proceed hover:cursor-pointer hover:shadow-lg">View Invoice</button>
			</div>
		{:else}
			<p class="text-gray-500 text-lg">
				Something went wrong. Please contact support.
			</p>
		{/if}
	</div>
</div>

<!-- +page.svelte -->
<script lang="ts">
	// Mock values for frontend testing
	const status = 'PAYMENT_SUCCESS'; // Test values: 'PAYMENT_FAILED', 'PAYMENT_PENDING', etc.
	const orderId = 'MOCK_ORDER_123456';
</script>

<style>
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

	.header-2{
		color: var(--Global-black, #000);

		/* Headings/h2 */
		font-family: "Space Grotesk";
		font-size: 2.375rem;
		font-style: normal;
		font-weight: 700;
		line-height: 2.925rem; /* 123.158% */
	}

	.confirmation{
		width: 51.375rem;
		height: 41.125rem;
		flex-shrink: 0;
		border-radius: 1rem;
		background: #D9D9D9;
	}

	.transaction{
		color: var(--Global-black, #000);
		font-family: "Space Grotesk";
		font-size: 2.5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 1.53125rem; /* 61.25% */
		letter-spacing: 0.075rem;
	}

	.font-details{
		color: var(--Global-black, #000);
		font-family: "Open Sans";
		font-size: 1.5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 0.9rem; /* 60% */
		text-transform: uppercase;
	}

	.email{
		color: var(--Global-black, #000);
		font-family: "Open Sans";
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 0.9rem; /* 90% */
		text-transform: uppercase;
	}

	.proceed{
		border-radius: 1.875rem;
		border: 1px solid var(--Yellow, #F2C94C);
		background: var(--Yellow, #F2C94C);
		display: flex;
		width: 34.3125rem;
		height: 7.125rem;
		padding: 0.5625rem 1.5rem;
		justify-content: center;
		align-items: center;
		gap: 0.625rem;
		flex-shrink: 0;
		color: var(--Gray-1, #333);
		font-family: Roboto;
		font-size: 2rem;
		font-style: normal;
		font-weight: 500;
		line-height: 1.3875rem; /* 69.375% */
		letter-spacing: 0.08rem;
	}
</style>
