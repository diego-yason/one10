<script lang="ts">
	import type { PageProps } from './$types';
	import type { Order } from '$types/firebase/Orders';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';

	let { data }: PageProps = $props();
	let { orders } = $derived(data);

	let showDetailsModal = $state(false);
	let selectedOrder: Order | null = $state(null);
	let searchTerm = $state('');
	let selectedStatus = $state('payment_pending' as Order['status']);
	let isUpdating = $state(false);
	let statusFilter = $state('all');
	let sortBy = $state('date_desc');

	function openDetailsModal(order: Order) {
		selectedOrder = order;
		console.log('Order status:', order.status);
		selectedStatus = order.status;
		showDetailsModal = true;
	}

	function closeModal() {
		showDetailsModal = false;
		selectedOrder = null;
		selectedStatus = 'payment_pending' as Order['status'];
		isUpdating = false;
	}

	async function updateOrderStatus() {
		if (!selectedOrder || isUpdating) return;

		isUpdating = true;
		try {
			const response = await fetch('/api/orders', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ orderId: selectedOrder.id, status: selectedStatus })
			});

			if (response.ok) {
				if (selectedOrder) {
					selectedOrder.status = selectedStatus;
				}

				location.reload();
			} else {
				console.error('Failed to update order status');
				alert('Failed to update order status. Please try again.');
			}
		} catch (error) {
			console.error('Error updating order status:', error);
			alert('An error occurred while updating the order status.');
		} finally {
			isUpdating = false;
		}
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
			case 'payment_pending':
			case 'payment_expired':
				return 'bg-yellow-300';
			case 'payment_cancelled':
			case 'refunded':
			case 'payment_failed':
				return 'bg-red-300';
			case 'completed':
			case 'payment_success':
				return 'bg-green-300';
			case 'processing_awaiting_items':
			case 'processing_studio':
			case 'ready_pickup':
			case 'dispatched':
				return 'bg-blue-300';
			default:
				return 'bg-gray-300';
		}
	}

	let filteredOrders = $derived.by(() => {
		if (!orders || !Array.isArray(orders)) return [];

		let filtered = orders.filter((order: Order) => {
			const searchMatch =
				searchTerm === '' ||
				order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.email?.toLowerCase().includes(searchTerm.toLowerCase());

			const statusMatch = statusFilter === 'all' || order.status === statusFilter;

			return searchMatch && statusMatch;
		});

		filtered.sort((a: Order, b: Order) => {
			switch (sortBy) {
				case 'name_asc':
					return (a.name || '').localeCompare(b.name || '');
				case 'name_desc':
					return (b.name || '').localeCompare(a.name || '');
				case 'id_asc':
					return (a.id || '').localeCompare(b.id || '');
				case 'id_desc':
					return (b.id || '').localeCompare(a.id || '');
				case 'date_asc':
					const aId = parseInt((a.id || '').replace('order_', ''), 10) || 0;
					const bId = parseInt((b.id || '').replace('order_', ''), 10) || 0;
					return aId - bId;
				case 'date_desc':
				default:
					const aIdDesc = parseInt((a.id || '').replace('order_', ''), 10) || 0;
					const bIdDesc = parseInt((b.id || '').replace('order_', ''), 10) || 0;
					return bIdDesc - aIdDesc;
			}
		});

		return filtered;
	});
</script>

<div class="flex flex-col space-y-6">
	<div class="flex justify-between items-center mb-4">
		<div class="flex flex-1 items-center gap-4">
			<input
				type="text"
				placeholder="Search by Order Number, Customer Name, or Email"
				class="px-5 py-3 rounded-lg bg-white border-0 w-full max-w-xs"
				bind:value={searchTerm}
			/>
			<label for="status-filter" class="text-sm font-semibold ml-2 mr-2 mb-0">Status</label>
			<select
				id="status-filter"
				bind:value={statusFilter}
				class="px-5 py-3 rounded-lg bg-white border-0 text-sm w-44"
			>
				<option value="all">All Statuses</option>
				<option value="payment_pending">Payment Pending</option>
				<option value="payment_success">Payment Success</option>
				<option value="payment_failed">Payment Failed</option>
				<option value="payment_cancelled">Payment Cancelled</option>
				<option value="payment_expired">Payment Expired</option>
				<option value="processing_awaiting_items">Processing - Awaiting Items</option>
				<option value="processing_studio">Processing - Studio</option>
				<option value="ready_pickup">Ready for Pickup</option>
				<option value="dispatched">Dispatched</option>
				<option value="completed">Completed</option>
				<option value="refunded">Refunded</option>
			</select>
			<label for="sort-by" class="text-sm font-semibold ml-2 mr-2 mb-0">Sort by</label>
			<select
				id="sort-by"
				bind:value={sortBy}
				class="px-5 py-3 rounded-lg bg-white border-0 text-sm w-44"
			>
				<option value="date_desc">Newest First</option>
				<option value="date_asc">Oldest First</option>
				<option value="name_asc">Customer Name (A-Z)</option>
				<option value="name_desc">Customer Name (Z-A)</option>
				<option value="id_asc">Order ID (A-Z)</option>
				<option value="id_desc">Order ID (Z-A)</option>
			</select>
		</div>
		<button
			class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold ml-4"
			onclick={() => {
				searchTerm = '';
				statusFilter = 'all';
				sortBy = 'date_desc';
			}}
		>
			Clear Filters
		</button>
	</div>

	<div class="flex mb-5 justify-between">
		<p class="font-bold text-xl">
			Orders:
			<span class="text-lg font-normal">
				({filteredOrders.length} of {orders?.length || 0})
			</span>
		</p>
	</div>

	<div class="flex flex-col space-y-11">
		{#if filteredOrders.length === 0}
			<div class="bg-white rounded-2xl p-8 text-center">
				<p class="text-gray-500 text-lg">No orders found matching your criteria.</p>
				{#if searchTerm || statusFilter !== 'all'}
					<button
						class="mt-3 text-blue-600 hover:text-blue-800 underline"
						onclick={() => {
							searchTerm = '';
							statusFilter = 'all';
							sortBy = 'date_desc';
						}}
					>
						Clear filters to show all orders
					</button>
				{/if}
			</div>
		{:else}
			{#each filteredOrders as order}
				<div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
					<div class="flex justify-between">
						<p class="font-bold">{order.id}</p>

						<p class="flex items-center gap-3">
							{order.status.replace('_', ' ')}
							<span class="rounded-3xl w-5 h-5 {getStatusColor(order.status)}"></span>
						</p>
					</div>

					<p>Customer Name: <span class="font-bold">{order.name}</span></p>

					<div class="flex justify-between">
						<button
							class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl"
							onclick={() => openDetailsModal(order)}
						>
							Manage Details
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<Modal show={showDetailsModal} onClose={closeModal}>
	{#if selectedOrder}
		<form
			action="?/updateStatus"
			method="POST"
			use:enhance={() => {
				isUpdating = true;
				return async function () {
					isUpdating = false;
				};
			}}
			class="flex flex-col space-y-4 mt-4 text-sm"
		>
			<input type="hidden" name="orderId" value={selectedOrder?.id || ''} />
			<h2 class="text-xl font-bold text-white mb-4">Order Details</h2>

			<div class="bg-white rounded-lg p-4 space-y-3">
				<h3 class="font-bold text-lg text-gray-800 border-b pb-2">Order Information</h3>
				<div class="space-y-2 text-sm">
					<div><span class="font-semibold">Order ID:</span> {selectedOrder.id}</div>
					<div class="flex items-center gap-2">
						<span class="font-semibold">Status:</span>
						<select
							name="status"
							bind:value={selectedStatus}
							class="px-3 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="payment_pending">Payment Pending</option>
							<option value="payment_success">Payment Success</option>
							<option value="payment_failed">Payment Failed</option>
							<option value="payment_cancelled">Payment Cancelled</option>
							<option value="payment_expired">Payment Expired</option>
							<option value="processing_awaiting_items">Processing - Awaiting Items</option>
							<option value="processing_studio">Processing - Studio</option>
							<option value="ready_pickup">Ready for Pickup</option>
							<option value="dispatched">Dispatched</option>
							<option value="completed">Completed</option>
							<option value="refunded">Refunded</option>
						</select>
					</div>
					<div><span class="font-semibold">Total:</span> ₱{selectedOrder.grandTotal}</div>
					{#if selectedOrder.maya_checkoutId}
						<div>
							<span class="font-semibold">Maya Checkout:</span>
							{selectedOrder.maya_checkoutId}
						</div>
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
					<div>
						<span class="font-semibold">Postal Code:</span>
						{selectedOrder.address.postalCode}
					</div>
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
												<span class="font-medium"
													>{key
														.replace(/([A-Z])/g, ' $1')
														.replace(/^./, (str) => str.toUpperCase())}:</span
												>
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

			<div class="flex justify-end gap-3 mt-6">
				<button
					type="submit"
					class="text-black px-4 py-2 rounded transition-colors font-medium"
					style="background-color: #fed22e;"
					disabled={isUpdating}
					onmouseenter={(e) => {
						const target = e.target as HTMLButtonElement;
						if (target && !target.disabled) {
							target.style.backgroundColor = '#ffb803';
						}
					}}
					onmouseleave={(e) => {
						const target = e.target as HTMLButtonElement;
						if (target && !target.disabled) {
							target.style.backgroundColor = '#fed22e';
						}
					}}
				>
					{isUpdating ? 'Saving...' : 'Save Changes'}
				</button>
				<button
					type="button"
					class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
					onclick={closeModal}
				>
					Cancel
				</button>
			</div>
		</form>
	{/if}
</Modal>
