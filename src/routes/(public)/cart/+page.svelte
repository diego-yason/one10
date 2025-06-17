<script>
	import CartItem from './CartItem.svelte';
</script>

<div class="flex-col items-center justify-center text-center space-y-6 m-10">
	<!--Item container-->
	<h2
		class="text-gray-800 font-spaceGrotesk text-7xl font-bold text-left mx-auto w-3/4 mb-auto h-30"
	>
		Cart
	</h2>
	<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 mx-auto w-3/4">
		<div class="flex">
			<CartItem></CartItem>
		</div>
	</div>

	<!--Order Summary-->
	<div class="flex border-1 rounded-lg mx-auto w-3/4 my-auto y-100 p-5 text-left font-bold">
		<div>
			<h2>Order Summary</h2>
			<div class="flex space-x-4">
				<h3>Total</h3>
				<h3 class="font-normal">P500</h3>
			</div>
		</div>
		<div class="ml-auto">
			<button
				class="bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition duration-300"
				>Checkout</button
			>
		</div>
	</div>
</div>
