<script lang="ts">
	import type { PageProps } from './$types';
	import type { Order } from '$types/firebase/Orders';
	import Modal from '$lib/components/Modal.svelte';
	
	let { data }: PageProps = $props();
	let { orders } = $derived(data);
	
	let showDetailsModal = $state(false);
	let selectedOrder: Order | null = $state(null);
	let searchTerm = $state('');

	function openDetailsModal(order: Order) {
		selectedOrder = order;
		showDetailsModal = true;
	}

	function closeModal() {
		showDetailsModal = false;
		selectedOrder = null;
	}

	function formatDate(timestamp: any): string {
		if (!timestamp) return 'N/A';
		if (timestamp.seconds) {
			return new Date(timestamp.seconds * 1000).toLocaleString();
		}
		return new Date(timestamp).toLocaleString();
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'pending_payment':
			case 'awaiting_films':
				return 'bg-yellow-300';
			case 'cancelled':
			case 'refunded':
			case 'payment_failed':
				return 'bg-red-300';
			case 'completed':
				return 'bg-green-300';
			case 'processing':
				return 'bg-blue-300';
			default:
				return 'bg-gray-300';
		}
	}

	let filteredOrders = $derived(orders.filter(order => 
		order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
		order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		order.email.toLowerCase().includes(searchTerm.toLowerCase())
	));
</script>

<input
	type="text"
	placeholder="Search Order Number or Customer Name"
	class="px-5 py-3 rounded-lg bg-white border-0 w-110"
	bind:value={searchTerm}
/>
<div class="flex flex-col mt-8">
	<div class="flex mb-5 justify-between">
		<p class="font-bold text-xl">Orders:</p>

		<button
			class="font-bold rounded-2xl bg-white px-7 hover:cursor-pointer hover:bg-black hover:text-white"
			>Filter</button
		>
	</div>

	<div class="flex flex-col space-y-11">
		{#each filteredOrders as order}
			<div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
				<div class="flex justify-between">
					<p class="font-bold">Order {order.id}</p>

					<p class="flex items-center gap-3">
						{order.status.replace('_', ' ')}
						<span
							class="rounded-3xl w-5 h-5 {getStatusColor(order.status)}"
						></span>
					</p>
				</div>

				<p>Customer Name: <span class="font-bold">{order.name}</span></p>

				<div class="flex justify-between">
					<button
						class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl"
						onclick={() => openDetailsModal(order)}
					>
						View Details
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<Modal show={showDetailsModal} onClose={closeModal}>
	{#if selectedOrder}
		<div class="flex flex-col space-y-4 mt-4 text-sm">
			<h2 class="text-xl font-bold text-white mb-4">Order Details</h2>
			
			<div class="bg-white rounded-lg p-4 space-y-3">
				<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Order Information</h3>
				<div class="space-y-2 text-sm">
					<div><span class="font-semibold">Order ID:</span> {selectedOrder.id}</div>
					<div class="flex items-center gap-2">
						<span class="font-semibold">Status:</span> 
						<span class="px-3 py-1 rounded-full text-xs text-white {getStatusColor(selectedOrder.status)}">
							{selectedOrder.status.replace('_', ' ')}
						</span>
					</div>
					<div><span class="font-semibold">Total:</span> ₱{selectedOrder.grandTotal}</div>
					{#if selectedOrder.maya_checkoutId}
						<div><span class="font-semibold">Maya Checkout:</span> {selectedOrder.maya_checkoutId}</div>
					{/if}
				</div>
			</div>

			<div class="bg-white rounded-lg p-4 space-y-3">
				<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Customer Information</h3>
				<div class="space-y-2 text-sm">
					<div><span class="font-semibold">Name:</span> {selectedOrder.name}</div>
					<div><span class="font-semibold">Email:</span> {selectedOrder.email}</div>
					<div><span class="font-semibold">Phone:</span> {selectedOrder.phone}</div>
				</div>
			</div>

			<div class="bg-white rounded-lg p-4 space-y-3">
				<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Shipping Address</h3>
				<div class="space-y-2 text-sm">
					<div><span class="font-semibold">Address:</span> {selectedOrder.address.address}</div>
					<div><span class="font-semibold">City:</span> {selectedOrder.address.city}</div>
					<div><span class="font-semibold">Province:</span> {selectedOrder.address.province}</div>
					<div><span class="font-semibold">Postal Code:</span> {selectedOrder.address.postalCode}</div>
				</div>
			</div>

			<div class="bg-white rounded-lg p-4 space-y-3">
				<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Order Items</h3>
				<div class="space-y-4">
					{#each selectedOrder.items as item}
						<div class="border rounded-lg p-3 bg-gray-50">
							<div class="flex justify-between items-start mb-2">
								<div class="flex-1">
									<div class="font-semibold">{item.name}</div>
									<div class="text-sm text-gray-600">Code: {item.itemCode}</div>
									<div class="text-sm">Quantity: {item.quantity}</div>
									<div class="text-sm font-semibold">Price: ₱{item.price}</div>
								</div>
							</div>
							
							{#if item.details && Object.keys(item.details).length > 0}
								<div class="mt-3 p-2 bg-white rounded border">
									<div class="font-semibold text-sm mb-2">Item Details:</div>
									<div class="text-xs space-y-1">
										{#each Object.entries(item.details) as [key, value]}
											<div>
												<span class="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
												{#if typeof value === 'boolean'}
													{value ? 'Yes' : 'No'}
												{:else}
													{value}
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if item.addons && item.addons.length > 0}
								<div class="mt-3 p-2 bg-white rounded border">
									<div class="font-semibold text-sm mb-2">Add-ons:</div>
									<div class="text-xs space-y-1">
										{#each item.addons as addon}
											<div class="flex justify-between">
												<span>{addon.name} (x{addon.quantity})</span>
												<span>₱{addon.price}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							{#if item.notes}
								<div class="mt-3 p-2 bg-white rounded border">
									<div class="font-semibold text-sm mb-1">Notes:</div>
									<div class="text-xs">{item.notes}</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			{#if selectedOrder.notes}
				<div class="bg-white rounded-lg p-4 space-y-3">
					<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Order Notes</h3>
					<div class="text-sm">{selectedOrder.notes}</div>
				</div>
			{/if}

			<div class="flex justify-end mt-6">
				<button
					class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
					onclick={closeModal}
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</Modal>
