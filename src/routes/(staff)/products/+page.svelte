<div class="flex flex-col space-y-6">
	<div class="flex justify-between items-center">
		<div class="flex space-y-6 flex-col">
			<input 
				type="text" 
				placeholder="Search Product Name" 
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
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredProducts as product}
				<div class="flex flex-col bg-white h-auto shadow-2xl rounded-3xl items-center hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105">
					<div class="h-50 w-full bg-gray-100 object-cover flex items-center justify-center rounded-t-3xl">
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="w-full h-full object-cover rounded-t-3xl" />
						{:else}
							<span class="text-gray-500">No image</span>
						{/if}
					</div>

					<div class="flex flex-col justify-center items-center space-y-4 p-6 w-full">
						<p class="font-bold text-xl text-center">{product.name}</p>
						<p class="text-sm text-gray-600 text-center">{product.category}</p>
						<p class="font-semibold text-lg">₱{product.price}</p>
						<div class="flex items-center space-x-2">
							<span class="text-sm">Stock: {product.stock}</span>
							<span class="text-xs px-2 py-1 rounded-full {product.status === 'available' ? 'bg-green-100 text-green-800' : product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
								{product.status.replace('_', ' ')}
							</span>
						</div>
						<div class="flex space-x-2 w-full">
							<button 
								class="flex-1 border px-4 py-2 rounded-full hover:cursor-pointer hover:bg-black hover:text-white transition-colors" 
								on:click={() => openModal(product)}
							>
								Edit
							</button>
							<button 
								class="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-full hover:cursor-pointer hover:bg-red-500 hover:text-white transition-colors" 
								on:click={() => deleteProduct(product)}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Edit Product Modal -->
<Modal show={showModal} onClose={closeModal}>
	<div class="flex flex-col space-y-6 mt-10">
		<h2 class="text-2xl font-bold text-white mb-4">Edit Product</h2>
		
		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Item Code:</p>
			<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" placeholder="Enter item code" bind:value={formData.itemCode} required />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Name:</p>
			<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" bind:value={formData.name} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Category:</p>
			<select class="px-3 py-2 bg-white rounded-lg border-0" bind:value={formData.category}>
				<option value="Non-Film">Non-Film</option>
				<option value="Film 35mm">Film 35mm</option>
				<option value="Film 120mm">Film 120mm</option>
				<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
			</select>
		</div>

		{#if formData.category !== 'Non-Film'}
			<div class="flex space-x-2 items-center">
				<p class="font-bold text-white w-24">Expiry Date:</p>
				<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" placeholder="MM/YYYY or N/A" bind:value={formData.expiryDate} />
			</div>
		{/if}

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Price:</p>
			<input type="number" class="px-3 py-2 bg-white rounded-lg w-32 border-0" bind:value={formData.price} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Stock:</p>
			<input type="number" class="px-3 py-2 bg-white rounded-lg w-32 border-0" bind:value={formData.stock} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Status:</p>
			<select class="px-3 py-2 bg-white rounded-lg border-0" bind:value={formData.status}>
				<option value="available">Available</option>
				<option value="not_available">Not Available</option>
				<option value="out_of_stock">Out of Stock</option>
			</select>
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Image:</p>
			<input type="file" accept="image/*" on:change={handleImageUpload} class="px-3 py-2 bg-white rounded-lg border-0" />
		</div>

		<div class="flex space-y-2 flex-col">
			<p class="text-white font-bold">Description:</p>
			<textarea 
				class="w-full h-32 px-3 py-2 bg-white rounded-lg border-0 resize-none" 
				placeholder="Product description..."
				bind:value={formData.description}
			></textarea>
		</div>

		<div class="flex space-x-4">
			<button 
				class="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex-1"
				on:click={saveProduct}
			>
				Save Changes
			</button>
			<button 
				class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex-1"
				on:click={closeModal}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>

<!-- Add Product Modal -->
<Modal show={showAddModal} onClose={closeModal}>
	<div class="flex flex-col space-y-6 mt-10">
		<h2 class="text-2xl font-bold text-white mb-4">Add New Product</h2>
		
		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Item Code:</p>
			<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" placeholder="Enter item code" bind:value={formData.itemCode} required />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Name:</p>
			<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" bind:value={formData.name} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Category:</p>
			<select class="px-3 py-2 bg-white rounded-lg border-0" bind:value={formData.category}>
				<option value="Non-Film">Non-Film</option>
				<option value="Film 35mm">Film 35mm</option>
				<option value="Film 120mm">Film 120mm</option>
				<option value="Simple Use - Disposable Camera">Simple Use - Disposable Camera</option>
			</select>
		</div>

		{#if formData.category !== 'Non-Film'}
			<div class="flex space-x-2 items-center">
				<p class="font-bold text-white w-24">Expiry Date:</p>
				<input type="text" class="px-3 py-2 bg-white rounded-lg flex-1 border-0" placeholder="MM/YYYY or N/A" bind:value={formData.expiryDate} />
			</div>
		{/if}

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Price:</p>
			<input type="number" class="px-3 py-2 bg-white rounded-lg w-32 border-0" bind:value={formData.price} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Stock:</p>
			<input type="number" class="px-3 py-2 bg-white rounded-lg w-32 border-0" bind:value={formData.stock} />
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Status:</p>
			<select class="px-3 py-2 bg-white rounded-lg border-0" bind:value={formData.status}>
				<option value="available">Available</option>
				<option value="not_available">Not Available</option>
				<option value="out_of_stock">Out of Stock</option>
			</select>
		</div>

		<div class="flex space-x-2 items-center">
			<p class="font-bold text-white w-24">Image:</p>
			<input type="file" accept="image/*" on:change={handleImageUpload} class="px-3 py-2 bg-white rounded-lg border-0" />
		</div>

		<div class="flex space-y-2 flex-col">
			<p class="text-white font-bold">Description:</p>
			<textarea 
				class="w-full h-32 px-3 py-2 bg-white rounded-lg border-0 resize-none" 
				placeholder="Product description..."
				bind:value={formData.description}
			></textarea>
		</div>

		<div class="flex space-x-4">
			<button 
				class="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex-1"
				on:click={saveProduct}
			>
				Add Product
			</button>
			<button 
				class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex-1"
				on:click={closeModal}
			>
				Cancel
			</button>
		</div>
	</div>
</Modal>

<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { ProductService, type Product } from '$lib/firebase';
	import { products, loading, error, loadProducts } from '$lib/stores/products';
	import { onMount } from 'svelte';

	const productService = ProductService.getInstance();

	let showModal = false;
	let showAddModal = false;
	let selectedProduct: Product | null = null;
	let searchTerm = '';
	let errorMessage = '';

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

	async function deleteProduct(product: Product) {
		if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
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
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			formData.imageFile = target.files[0];
		}
	}

	// Filter products based on search term
	$: filteredProducts = $products.filter(product =>
		product.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.category.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>