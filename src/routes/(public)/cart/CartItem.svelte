<script lang="ts">
	let { i, name, type, price, quantity, details, imageUrl, updateQuantity, removeItem } = $props();

	let localQuantity = $state(quantity);
	$effect(() => {
		if (localQuantity <= 0) removeItem(i);
		else updateQuantity(i, localQuantity);
	});
</script>

<div class="flex bg-[#D9D9D9] p-4 rounded-lg mt-4 items-center">
	{#if imageUrl}
		<div class="cart-image-container">
			<img src={imageUrl} alt={name} class="cart-image" />
		</div>
	{/if}
	<div class="flex flex-1">
		<div class="flex-col text-left space-y-35">
			<div>
				<h6 class="m-5 font-spaceGrotesk font-bold">
					{type === 'product' ? 'Product' : 'Service'}
				</h6>
				<p class="m-5">{name}</p>
				{#if details}
					{#if type === 'service'}
						<div class="m-5 text-xs bg-gray-100 p-2 rounded service-details">
							{#if name === 'Disposable Camera' || name === '35mm Film' || name === '120mm Film'}
								<div><b>Film Brand:</b> {details.filmBrand}</div>
								<div><b>Process Type:</b> {details.processType}</div>
								<div><b>Returning Negatives:</b> {details.returningNegatives}</div>
								<div><b>Scan/Process Option:</b> {details.scanOption}</div>
							{:else if name === 'Printing'}
								<div><b>Photo Size:</b> {details.photoSize}</div>
								<div><b>Total Photos:</b> {details.totalPhotos}</div>
								<div><b>Access Photos:</b> {details.accessPhotos}</div>
								{#if details.linkPhotos}
									<div><b>Link to Photos:</b> {details.linkPhotos}</div>
								{/if}
								<div>
									<b>Drop-off:</b>
									{details.dropoffMode === 'other' ? details.dropoffOther : details.dropoffMode}
								</div>
								<div>
									<b>Pick-up:</b>
									{details.pickupMode === 'other' ? details.pickupOther : details.pickupMode}
								</div>
							{:else}
								<div>{JSON.stringify(details)}</div>
							{/if}
						</div>
					{:else}
						<pre class="m-5 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(
								details,
								null,
								2
							)}</pre>
					{/if}
				{/if}
			</div>
			<div>
				{#if type === 'product'}
					<div class="flex border-1 w-32 m-5 rounded-lg justify-around">
						<button
							class="px-1.5 basis-1/4 py-3 border-r-[1px] border-black"
							onclick={() => localQuantity--}
							disabled={localQuantity <= 0}
						>
							-
						</button>
						<input type="number" min="0" class="w-12 text-center" value={localQuantity} />
						<button
							class="px-1.5 basis-1/4 py-3 border-l-[1px] border-black"
							onclick={() => localQuantity++}>+</button
						>
					</div>
				{:else}
					<span style="display:block; margin-top:0.5rem;">Qty: {localQuantity}</span>
				{/if}
				<h6 class="text-left font-bold" style="margin-top:0.25rem;">
					₱{price * localQuantity}
				</h6>
			</div>
		</div>
	</div>
	<button class="ml-8 text-red-600 font-bold" onclick={() => removeItem(i)}>Remove</button>
</div>

<style>
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
