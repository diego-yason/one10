<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { ProductService } from '$lib/services/products';
	import type { Product } from '$types/products';
	import { products, loading, error, loadProducts } from '$lib/stores/products';
	import { onMount } from 'svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	const productService = ProductService.getInstance();

	let showModal = false;
	let showAddModal = false;
	let selectedProduct: Product | null = null;
	let searchTerm = '';
	let errorMessage = '';
	let showConfirmModal = false;
	let productToDelete: Product | null = null;
	let selectedCategory = 'All';
	let sortBy = 'name-asc';
	const categories = [
		'All',
		'Non-Film',
		'Film 35mm',
		'Film 120mm',
		'Simple Use - Disposable Camera'
	];

	const sortOptions = [
		{ value: 'name-asc', label: 'Name A-Z' },
		{ value: 'name-desc', label: 'Name Z-A' },
		{ value: 'price-high', label: 'Price High to Low' },
		{ value: 'price-low', label: 'Price Low to High' },
		{ value: 'stock-high', label: 'Stock High to Low' },
		{ value: 'stock-low', label: 'Stock Low to High' }
	];

	let formData = {
		itemCode: '',
		name: '',
		description: '',
		price: 0,
		stock: 0,
		status: 'available' as const,
		category: 'Non-Film',
		imageFile: null as File | null,
		expiryDate: ''
	};

	onMount(async () => {
		await loadProducts();
	});

	function openModal(product: Product) {
		selectedProduct = product;
		formData = {
			itemCode: product.itemCode,
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			status: product.status as typeof formData.status,
			category: product.category,
			imageFile: null,
			expiryDate: product.expiryDate || ''
		};
		showModal = true;
	}

	function openAddModal() {
		selectedProduct = null;
		formData = {
			itemCode: '',
			name: '',
			description: '',
			price: 0,
			stock: 0,
			status: 'available',
			category: 'Non-Film',
			imageFile: null,
			expiryDate: ''
		};
		showAddModal = true;
	}

	function closeModal() {
		showModal = false;
		showAddModal = false;
		selectedProduct = null;
	}

	async function saveProduct() {
		try {
			const expiryDateToSave =
				formData.category !== 'Non-Film' && formData.expiryDate ? formData.expiryDate : null;
			
			if (selectedProduct) {
				// Update existing product using API
				const response = await fetch('/api/products', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						productId: selectedProduct.id,
						itemCode: formData.itemCode,
						name: formData.name,
						description: formData.description,
						price: formData.price,
						stock: formData.stock,
						status: formData.status,
						category: formData.category,
						expiryDate: expiryDateToSave
					})
				});

				if (!response.ok) {
					throw new Error('Failed to update product');
				}

				// Handle image upload separately using service
				if (formData.imageFile) {
					if (selectedProduct.imageUrl) {
						await productService.deleteProductImage(selectedProduct.imageUrl);
					}
					const imageUrl = await productService.uploadProductImage(
						formData.imageFile,
						selectedProduct.id!
					);
					// Update with new image URL using API
					await fetch('/api/products', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							productId: selectedProduct.id,
							imageUrl
						})
					});
				}
			} else {
				// Create new product using API
				const response = await fetch('/api/products', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						itemCode: formData.itemCode,
						name: formData.name,
						description: formData.description,
						price: formData.price,
						stock: formData.stock,
						status: formData.status,
						category: formData.category,
						expiryDate: expiryDateToSave
					})
				});

				if (!response.ok) {
					throw new Error('Failed to create product');
				}

				const result = await response.json();
				const productId = result.productId;

				// Handle image upload separately using service
				if (formData.imageFile) {
					const imageUrl = await productService.uploadProductImage(formData.imageFile, productId);
					// Update with new image URL using API
					await fetch('/api/products', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							productId,
							imageUrl
						})
					});
				}
			}

			await loadProducts();
			closeModal();
		} catch (error) {
			console.error('Error saving product:', error);
			errorMessage = 'Failed to save product';
		}
	}

	function askDeleteProduct(product: Product) {
		productToDelete = product;
		showConfirmModal = true;
	}

	function handleConfirmDelete() {
		if (productToDelete) {
			deleteProduct(productToDelete);
		}
		showConfirmModal = false;
		productToDelete = null;
	}

	function handleCancelDelete() {
		showConfirmModal = false;
		productToDelete = null;
	}

	async function deleteProduct(product: Product) {
		try {
			// Delete product using API
			const response = await fetch('/api/products', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ productId: product.id })
			});

			if (!response.ok) {
				throw new Error('Failed to delete product');
			}

			// Delete image using service if it exists
			if (product.imageUrl) {
				await productService.deleteProductImage(product.imageUrl);
			}
			
			await loadProducts();
		} catch (error) {
			console.error('Error deleting product:', error);
			errorMessage = 'Failed to delete product';
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			formData.imageFile = target.files[0];
		}
	}

	$: filteredProducts = $products
		.filter(
			(product) =>
				(selectedCategory === 'All' || product.category === selectedCategory) &&
				(product.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.name.toLowerCase().includes(searchTerm.toLowerCase()))
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'name-asc':
					return a.name.localeCompare(b.name);
				case 'name-desc':
					return b.name.localeCompare(a.name);
				case 'price-high':
					return b.price - a.price;
				case 'price-low':
					return a.price - b.price;
				case 'stock-high':
					return b.stock - a.stock;
				case 'stock-low':
					return a.stock - b.stock;
				default:
					return 0;
			}
		});
</script>

<div class="flex flex-col space-y-6">
	<div class="flex justify-between items-center mb-4">
		<div class="flex flex-1 items-center gap-4">
			<input
				type="text"
				placeholder="Search by Product Code or Name"
				class="px-5 py-3 rounded-lg bg-white border-0 w-full max-w-xs"
				bind:value={searchTerm}
			/>
			<label for="category-filter" class="text-sm font-semibold ml-2 mr-2 mb-0">Category</label>
			<select
				id="category-filter"
				bind:value={selectedCategory}
				class="px-5 py-3 rounded-lg bg-white border-0 text-sm w-44"
			>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
			<label for="sort-filter" class="text-sm font-semibold ml-2 mr-2 mb-0">Sort by</label>
			<select
				id="sort-filter"
				bind:value={sortBy}
				class="px-5 py-3 rounded-lg bg-white border-0 text-sm w-44"
			>
				{#each sortOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
		<button
			class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
			on:click={() => {
				searchTerm = '';
				selectedCategory = 'All';
				sortBy = 'name-asc';
			}}
		>
			Clear Filters
		</button>
	</div>

	<div class="flex mb-5 justify-between">
		<p class="font-bold text-xl">
			Products: 
			<span class="text-lg font-normal">
				({filteredProducts.length} of {$products?.length || 0})
			</span>
		</p>
	</div>

	{#if errorMessage}
		<div class="bg-red-500 text-white p-3 rounded-lg">
			{errorMessage}
		</div>
	{/if}

	{#if $error}
		<div class="bg-red-500 text-white p-3 rounded-lg">
			{$error}
		</div>
	{/if}

	{#if $loading}
		<div class="flex justify-center items-center py-20">
			<p class="text-lg">Loading products...</p>
		</div>
	{:else if filteredProducts.length === 0}
		<div class="flex justify-center items-center py-20">
			<p class="text-lg text-gray-600">No products found</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each filteredProducts as product}
				<div
					class="flex flex-col bg-white h-auto shadow-lg rounded-2xl items-center hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 p-3"
				>
					<div
						class="h-32 w-full bg-gray-100 object-cover flex items-center justify-center rounded-t-2xl"
					>
						{#if product.imageUrl}
							<img
								src={product.imageUrl}
								alt={product.name}
								class="w-full h-full object-contain rounded-t-2xl max-h-32"
							/>
						{:else}
							<span class="text-gray-500">No image</span>
						{/if}
					</div>
					<div class="flex flex-col justify-center items-center space-y-2 p-3 w-full">
						<p class="font-bold text-base text-center">{product.name}</p>
						<p class="text-xs text-gray-600 text-center">{product.category}</p>
						<p class="font-semibold text-base">₱{product.price}</p>
						<div class="flex items-center space-x-1">
							<span class="text-xs">Stock: {product.stock}</span>
							<span
								class="text-xs px-2 py-0.5 rounded-full {product.status === 'available'
									? 'bg-green-100 text-green-800'
									: product.status === 'out_of_stock'
										? 'bg-red-100 text-red-800'
										: 'bg-yellow-100 text-yellow-800'}"
							>
								{product.status.replaceAll('_', ' ')}
							</span>
						</div>
						<div class="flex space-x-1 w-full">
							<button
								class="flex-1 border px-2 py-1 rounded-full text-xs hover:cursor-pointer hover:bg-black hover:text-white transition-colors"
								on:click={() => openModal(product)}
							>
								Edit
							</button>
							<button
								class="flex-1 border border-red-500 text-red-500 px-2 py-1 rounded-full text-xs hover:cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
								on:click={() => askDeleteProduct(product)}
							>
								Delete
							</button>
						</div>
						<p class="text-xs text-gray-400 mb-1">Code: {product.itemCode}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex justify-end mt-8">
		<button
			on:click={openAddModal}
			class="bg-amber-300 text-black px-8 py-4 rounded-lg hover:bg-amber-400 transition-colors font-semibold text-lg"
		>
			+ Add New Product
		</button>
	</div>
</div>

<Modal show={showModal} onClose={closeModal}>
	<div class="flex flex-col space-y-4 mt-4 text-sm">
		<h2 class="text-xl font-bold text-white mb-6">Edit Product</h2>
		
		<div class="bg-white rounded-lg p-4 space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="edit-itemCode" class="block font-semibold text-gray-700 mb-1">Item Code:</label>
					<input
						id="edit-itemCode"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						placeholder="Enter item code"
						bind:value={formData.itemCode}
						required
					/>
				</div>
				<div>
					<label for="edit-name" class="block font-semibold text-gray-700 mb-1">Name:</label>
					<input
						id="edit-name"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.name}
					/>
				</div>
			</div>
			
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="edit-category" class="block font-semibold text-gray-700 mb-1">Category:</label>
					<select id="edit-category" class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none" bind:value={formData.category}>
						<option value="Non-Film">Non-Film</option>
						<option value="Film 35mm">Film 35mm</option>
						<option value="Film 120mm">Film 120mm</option>
						<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
					</select>
				</div>
				<div>
					<label for="edit-status" class="block font-semibold text-gray-700 mb-1">Status:</label>
					<select id="edit-status" class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none" bind:value={formData.status}>
						<option value="available">Available</option>
						<option value="not_available">Not Available</option>
						<option value="out_of_stock">Out of Stock</option>
					</select>
				</div>
			</div>

			{#if formData.category !== 'Non-Film'}
				<div>
					<label for="edit-expiryDate" class="block font-semibold text-gray-700 mb-1">Expiry Date:</label>
					<input
						id="edit-expiryDate"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						placeholder="MM/YYYY or N/A"
						bind:value={formData.expiryDate}
					/>
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="edit-price" class="block font-semibold text-gray-700 mb-1">Price:</label>
					<input
						id="edit-price"
						type="number"
						min="0"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.price}
					/>
				</div>
				<div>
					<label for="edit-stock" class="block font-semibold text-gray-700 mb-1">Stock:</label>
					<input
						id="edit-stock"
						type="number"
						min="0"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.stock}
					/>
				</div>
			</div>

			<div>
				<label for="edit-image" class="block font-semibold text-gray-700 mb-1">Image:</label>
				<div class="relative">
					<input
						id="edit-image"
						type="file"
						accept="image/*"
						on:change={handleImageUpload}
						class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
					<div class="flex">
						<button
							type="button"
							class="px-4 py-2 text-black rounded-l border transition-colors hover:text-black"
							style="background-color: #fed22e; border-color: #fed22e;"
							on:mouseenter={(e) => { 
								const target = e.target as HTMLButtonElement;
								if (target) {
									target.style.backgroundColor='#ffb803'; 
									target.style.borderColor='#ffb803'; 
								}
							}}
							on:mouseleave={(e) => { 
								const target = e.target as HTMLButtonElement;
								if (target) {
									target.style.backgroundColor='#fed22e'; 
									target.style.borderColor='#fed22e'; 
								}
							}}
						>
							Choose File
						</button>
						<div class="flex-1 px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r text-gray-600 text-sm">
							{formData.imageFile ? formData.imageFile.name : 'No file chosen'}
						</div>
					</div>
				</div>
			</div>

			<div>
				<label for="edit-description" class="block font-semibold text-gray-700 mb-1">Description:</label>
				<textarea
					id="edit-description"
					class="w-full h-24 px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
					placeholder="Product description..."
					bind:value={formData.description}
				></textarea>
			</div>
		</div>

		<div class="flex justify-end gap-3 mt-6">
			<button
				class="text-black px-6 py-2 rounded transition-colors font-medium"
				style="background-color: #fed22e;"
				on:mouseenter={(e) => { 
					const target = e.target as HTMLButtonElement;
					if (target) {
						target.style.backgroundColor='#ffb803'; 
					}
				}}
				on:mouseleave={(e) => { 
					const target = e.target as HTMLButtonElement;
					if (target) {
						target.style.backgroundColor='#fed22e'; 
					}
				}}
				on:click={saveProduct}
			>
				Save Changes
			</button>
			<button
				class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
				on:click={closeModal}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>

<Modal show={showAddModal} onClose={closeModal}>
	<div class="flex flex-col space-y-4 mt-4 text-sm">
		<h2 class="text-xl font-bold text-white mb-6">Add New Product</h2>
		
		<div class="bg-white rounded-lg p-4 space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="add-itemCode" class="block font-semibold text-gray-700 mb-1">Item Code:</label>
					<input
						id="add-itemCode"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						placeholder="Enter item code"
						bind:value={formData.itemCode}
						required
					/>
				</div>
				<div>
					<label for="add-name" class="block font-semibold text-gray-700 mb-1">Name:</label>
					<input
						id="add-name"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.name}
					/>
				</div>
			</div>
			
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="add-category" class="block font-semibold text-gray-700 mb-1">Category:</label>
					<select id="add-category" class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none" bind:value={formData.category}>
						<option value="Non-Film">Non-Film</option>
						<option value="Film 35mm">Film 35mm</option>
						<option value="Film 120mm">Film 120mm</option>
						<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
					</select>
				</div>
				<div>
					<label for="add-status" class="block font-semibold text-gray-700 mb-1">Status:</label>
					<select id="add-status" class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none" bind:value={formData.status}>
						<option value="available">Available</option>
						<option value="not_available">Not Available</option>
						<option value="out_of_stock">Out of Stock</option>
					</select>
				</div>
			</div>

			{#if formData.category !== 'Non-Film'}
				<div>
					<label for="add-expiryDate" class="block font-semibold text-gray-700 mb-1">Expiry Date:</label>
					<input
						id="add-expiryDate"
						type="text"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						placeholder="MM/YYYY or N/A"
						bind:value={formData.expiryDate}
					/>
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="add-price" class="block font-semibold text-gray-700 mb-1">Price:</label>
					<input
						id="add-price"
						type="number"
						min="0"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.price}
					/>
				</div>
				<div>
					<label for="add-stock" class="block font-semibold text-gray-700 mb-1">Stock:</label>
					<input
						id="add-stock"
						type="number"
						min="0"
						class="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
						bind:value={formData.stock}
					/>
				</div>
			</div>

			<div>
				<label for="add-image" class="block font-semibold text-gray-700 mb-1">Image:</label>
				<div class="relative">
					<input
						id="add-image"
						type="file"
						accept="image/*"
						on:change={handleImageUpload}
						class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
					<div class="flex">
						<button
							type="button"
							class="px-4 py-2 text-black rounded-l border transition-colors hover:text-black"
							style="background-color: #fed22e; border-color: #fed22e;"
							on:mouseenter={(e) => { 
								const target = e.target as HTMLButtonElement;
								if (target) {
									target.style.backgroundColor='#ffb803'; 
									target.style.borderColor='#ffb803'; 
								}
							}}
							on:mouseleave={(e) => { 
								const target = e.target as HTMLButtonElement;
								if (target) {
									target.style.backgroundColor='#fed22e'; 
									target.style.borderColor='#fed22e'; 
								}
							}}
						>
							Choose File
						</button>
						<div class="flex-1 px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r text-gray-600 text-sm">
							{formData.imageFile ? formData.imageFile.name : 'No file chosen'}
						</div>
					</div>
				</div>
			</div>

			<div>
				<label for="add-description" class="block font-semibold text-gray-700 mb-1">Description:</label>
				<textarea
					id="add-description"
					class="w-full h-24 px-3 py-2 bg-white rounded border border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
					placeholder="Product description..."
					bind:value={formData.description}
				></textarea>
			</div>
		</div>

		<div class="flex justify-end gap-3 mt-6">
			<button
				class="text-black px-6 py-2 rounded transition-colors font-medium"
				style="background-color: #fed22e;"
				on:mouseenter={(e) => { 
					const target = e.target as HTMLButtonElement;
					if (target) {
						target.style.backgroundColor='#ffb803'; 
					}
				}}
				on:mouseleave={(e) => { 
					const target = e.target as HTMLButtonElement;
					if (target) {
						target.style.backgroundColor='#fed22e'; 
					}
				}}
				on:click={saveProduct}
			>
				Add Product
			</button>
			<button
				class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
				on:click={closeModal}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>

<ConfirmModal
	show={showConfirmModal}
	message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
	confirmText="Delete"
	cancelText="Cancel"
	onConfirm={handleConfirmDelete}
	onCancel={handleCancelDelete}
/>
