<div class="flex flex-col space-y-6">
	<div class="flex justify-between items-center">
		<div class="flex space-y-6 flex-col">
			<input 
				type="text" 
				placeholder="Search Product Code" 
				class="px-5 py-3 rounded-lg bg-white border-0 w-110"
				bind:value={searchTerm}
			>
			<p class="font-bold">Products ({filteredProducts.length})</p>
		</div>
		<button 
			on:click={openAddModal}
			class="bg-amber-300 text-black px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors font-semibold"
		>
			+ Add New Product
		</button>
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
				<div class="flex flex-col bg-white h-auto shadow-lg rounded-2xl items-center hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 p-3">
					<div class="h-32 w-full bg-gray-100 object-cover flex items-center justify-center rounded-t-2xl">
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="w-full h-full object-contain rounded-t-2xl max-h-32" />
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
							<span class="text-xs px-2 py-0.5 rounded-full {product.status === 'available' ? 'bg-green-100 text-green-800' : product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
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
</div>

<!-- Edit Product Modal -->
<Modal show={showModal} onClose={closeModal}>
	<div class="flex flex-col space-y-3 mt-4 max-w-md mx-auto text-sm">
		<h2 class="text-xl font-bold text-white mb-8">Edit Product</h2>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Item Code:</p>
			<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" placeholder="Enter item code" bind:value={formData.itemCode} required />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Name:</p>
			<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" bind:value={formData.name} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Category:</p>
			<select class="px-2 py-1 bg-white rounded border-0 text-xs" bind:value={formData.category}>
				<option value="Non-Film">Non-Film</option>
				<option value="Film 35mm">Film 35mm</option>
				<option value="Film 120mm">Film 120mm</option>
				<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
			</select>
		</div>
		{#if formData.category !== 'Non-Film'}
			<div class="flex space-x-1 items-center">
				<p class="font-bold text-white w-20 text-xs">Expiry Date:</p>
				<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" placeholder="MM/YYYY or N/A" bind:value={formData.expiryDate} />
			</div>
		{/if}
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Price:</p>
			<input type="number" class="px-2 py-1 bg-white rounded w-20 border-0 text-xs" bind:value={formData.price} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Stock:</p>
			<input type="number" class="px-2 py-1 bg-white rounded w-20 border-0 text-xs" bind:value={formData.stock} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Status:</p>
			<select class="px-2 py-1 bg-white rounded border-0 text-xs" bind:value={formData.status}>
				<option value="available">Available</option>
				<option value="not_available">Not Available</option>
				<option value="out_of_stock">Out of Stock</option>
			</select>
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Image:</p>
			<input type="file" accept="image/*" on:change={handleImageUpload} class="px-2 py-1 bg-white rounded border-0 text-xs" />
		</div>
		<div class="flex flex-col space-y-1">
			<p class="text-white font-bold text-xs">Description:</p>
			<textarea 
				class="w-full h-20 px-2 py-1 bg-white rounded border-0 resize-none text-xs" 
				placeholder="Product description..."
				bind:value={formData.description}
			></textarea>
		</div>
		<div class="flex space-x-2 mt-2">
			<button 
				class="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors flex-1 text-xs"
				on:click={saveProduct}
			>
				Save Changes
			</button>
			<button 
				class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors flex-1 text-xs"
				on:click={closeModal}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>

<!-- Add Product Modal -->
<Modal show={showAddModal} onClose={closeModal}>
	<div class="flex flex-col space-y-3 mt-4 max-w-md mx-auto text-sm">
		<h2 class="text-xl font-bold text-white mb-8">Add New Product</h2>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Item Code:</p>
			<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" placeholder="Enter item code" bind:value={formData.itemCode} required />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Name:</p>
			<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" bind:value={formData.name} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Category:</p>
			<select class="px-2 py-1 bg-white rounded border-0 text-xs" bind:value={formData.category}>
				<option value="Non-Film">Non-Film</option>
				<option value="Film 35mm">Film 35mm</option>
				<option value="Film 120mm">Film 120mm</option>
				<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
			</select>
		</div>
		{#if formData.category !== 'Non-Film'}
			<div class="flex space-x-1 items-center">
				<p class="font-bold text-white w-20 text-xs">Expiry Date:</p>
				<input type="text" class="px-2 py-1 bg-white rounded flex-1 border-0 text-xs" placeholder="MM/YYYY or N/A" bind:value={formData.expiryDate} />
			</div>
		{/if}
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Price:</p>
			<input type="number" class="px-2 py-1 bg-white rounded w-20 border-0 text-xs" bind:value={formData.price} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Stock:</p>
			<input type="number" class="px-2 py-1 bg-white rounded w-20 border-0 text-xs" bind:value={formData.stock} />
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Status:</p>
			<select class="px-2 py-1 bg-white rounded border-0 text-xs" bind:value={formData.status}>
				<option value="available">Available</option>
				<option value="not_available">Not Available</option>
				<option value="out_of_stock">Out of Stock</option>
			</select>
		</div>
		<div class="flex space-x-1 items-center">
			<p class="font-bold text-white w-20 text-xs">Image:</p>
			<input type="file" accept="image/*" on:change={handleImageUpload} class="px-2 py-1 bg-white rounded border-0 text-xs" />
		</div>
		<div class="flex flex-col space-y-1">
			<p class="text-white font-bold text-xs">Description:</p>
			<textarea 
				class="w-full h-20 px-2 py-1 bg-white rounded border-0 resize-none text-xs" 
				placeholder="Product description..."
				bind:value={formData.description}
			></textarea>
		</div>
		<div class="flex space-x-2 mt-2">
			<button 
				class="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors flex-1 text-xs"
				on:click={saveProduct}
			>
				Add Product
			</button>
			<button 
				class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors flex-1 text-xs"
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

<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { ProductService, type Product } from '$lib/firebase';
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

	// Form data for adding/editing products
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

	// Load products on component mount
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
			status: product.status,
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
			const expiryDateToSave = (formData.category !== 'Non-Film' && formData.expiryDate) ? formData.expiryDate : null;
			if (selectedProduct) {
				// Update existing product
				await productService.updateProduct(selectedProduct.id!, {
					itemCode: formData.itemCode,
					name: formData.name,
					description: formData.description,
					price: formData.price,
					stock: formData.stock,
					status: formData.status,
					category: formData.category,
					expiryDate: expiryDateToSave
				});

				// If a new image is provided, delete the old one first
				if (formData.imageFile) {
					if (selectedProduct.imageUrl) {
						await productService.deleteProductImage(selectedProduct.imageUrl);
					}
					const imageUrl = await productService.uploadProductImage(formData.imageFile, selectedProduct.id!);
					await productService.updateProduct(selectedProduct.id!, { imageUrl });
				}
			} else {
				// Add new product
				const productId = await productService.addProduct({
					itemCode: formData.itemCode,
					name: formData.name,
					description: formData.description,
					price: formData.price,
					stock: formData.stock,
					status: formData.status,
					category: formData.category,
					expiryDate: expiryDateToSave
				});

				// Upload image if provided
				if (formData.imageFile) {
					const imageUrl = await productService.uploadProductImage(formData.imageFile, productId);
					await productService.updateProduct(productId, { imageUrl });
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
			await productService.deleteProduct(product.id!);
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

	// Filter products based on search term
	$: filteredProducts = $products.filter(product =>
		product.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>