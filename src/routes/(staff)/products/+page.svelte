<div class="flex space-y-6 flex-col">
    <input type="text" placeholder="Search Product Name" class="px-5 py-3 rounded-lg bg-white border-0 w-110">
    <p class="font-bold"> Products: </p>
</div>

<div class="flex justify-between mt-10">
    {#each products as product}
        <div class="flex flex-col bg-white h-100 w-70 shadow-2xl rounded-3xl items-center hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105">
            <div class="h-50 w-full bg-gray-100 object-cover flex items-center justify-center rounded-t-3xl">Image placeholder</div>

            <div class="flex flex-col justify-center items-center space-y-10 mt-10">
                <p class="font-bold text-xl">{product.name}</p>    
                <button class="border px-5 py-2 rounded-full hover:cursor-pointer hover:bg-black hover:text-white" on:click={() => openModal(product)}>Manage</button>
            </div>
        </div>
    {/each}
</div>

<Modal show={showModal} onClose={closeModal}>
  {#if selectedProduct}
    <div class="flex flex-col space-y-6 mt-10">
        <div class="flex space-x-2 items-center">
            <p class="font-bold text-gray-200">Product: </p>
            <input type="input" class="px-2 py-3 bg-white rounded-lg w-30 border-0" value={selectedProduct.name} />
        </div>

        <div class="flex space-x-2 items-center">
            <p class="font-bold text-white">Price: </p>
            <input type="input" class="px-2 py-3 bg-white rounded-lg w-30 border-0" value={selectedProduct.price} />
        </div>

        <div class="flex flex-col space-y-4">
            <p class="text-white font-bold">Mark as: </p>
            <div>
                <select class="appearance-none focus:outline-none px-5 py-3 bg-white rounded-full w-45 border-0">
                    <option>Available</option>
                    <option>Not available</option>
                    <option>Out of stock</option>
                </select>
            </div>
        </div>

        <div class="flex space-x-2 items-center">
            <p class="font-bold text-white">Number of items left: </p>
            <input type="number" class="px-2 py-3 bg-white rounded-lg w-30 border-0" value={selectedProduct.number} />
        </div>

       <div class="flex space-y-2 flex-col">
            <p class="text-white font-bold">Edit Description: </p>
            <textarea class="w-full h-100 px-5 py-3 bg-white rounded-lg border-0" placeholder="Edit product description here...">{selectedProduct.description}</textarea>
        </div>

        <button class="bg-white w-30 py-3 rounded-lg hover:bg-black hover:text-white hover:cursor-pointer">Save Changes</button>
    </div>
  {/if}
</Modal>

<script lang="ts">
    import Modal from '$lib/components/Modal.svelte';

    let showModal = false;
    let selectedProduct: Product | null = null;

    type Product = {
        id: number;
        name: string;
        description: string;
        price: number,
        number: number
    };

    const products: Product[] = [
    { id: 1, name: 'Product 1', description: '35mm color film, 36 exposures. Ideal for daylight shooting. ISO 200.', price: 100, number: 10 },
    { id: 2, name: 'Product 2', description: 'This is product 2', price: 200, number: 20 },
    { id: 3, name: 'Product 3', description: 'This is product 3', price: 300, number: 30 },
    { id: 4, name: 'Product 4', description: 'This is product 4', price: 400, number: 40}
  ];

  function openModal(product: Product) {
    selectedProduct = product;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>