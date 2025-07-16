<script lang="ts">
import { user, isStaffUser } from '$lib/stores/auth';
import { printingSchema, validateField } from '$lib/validation';
import { cart, showToast } from '$lib/stores/cart';

let photoSize = '';
let totalPhotos = '';
let accessPhotos = '';
let linkPhotos = '';
let dropoffMode = '';
let pickupMode = '';
let dropoffOther = '';
let pickupOther = '';

let errorMessages: string[] = [];
let fieldErrors: Record<string, string> = {};

// Real-time validation function
function handleFieldChange(field: string, value: string) {
	if (errorMessages.length > 0) {
		errorMessages = [];
	}

	if ([ 'dropoffOther', 'pickupOther', 'dropoffMode', 'pickupMode' ].includes(field)) {
		const result = printingSchema.safeParse({
			photoSize,
			totalPhotos,
			accessPhotos,
			linkPhotos,
			dropoffMode: field === 'dropoffMode' ? value : dropoffMode,
			dropoffOther: field === 'dropoffOther' ? value : dropoffOther,
			pickupMode: field === 'pickupMode' ? value : pickupMode,
			pickupOther: field === 'pickupOther' ? value : pickupOther,
		});
		let errors: Record<string, string> = {};
		if (!result.success) {
			result.error.errors.forEach(error => {
				const f = error.path[0] as string;
				errors[f] = error.message;
			});
		}
		fieldErrors = { ...fieldErrors, ...errors };
		if (value) {
			const { [field]: _, ...rest } = fieldErrors;
			fieldErrors = rest;
		}
		return;
	}

	const error = validateField(printingSchema, field as keyof typeof printingSchema.shape, value);
	if (error) {
		fieldErrors = { ...fieldErrors, [field]: error };
	} else {
		const { [field]: _, ...rest } = fieldErrors;
		fieldErrors = rest;
	}
}

const handleSubmit = (e: SubmitEvent) => {
	e.preventDefault();
	errorMessages = [];
	fieldErrors = {};

	const result = printingSchema.safeParse({ 
		photoSize, 
		totalPhotos, 
		accessPhotos, 
		linkPhotos, 
		dropoffMode, 
		dropoffOther,
		pickupMode, 
		pickupOther
	});
	
	if (!result.success) {
		if (result.error && Array.isArray(result.error.errors)) {
			result.error.errors.forEach(error => {
				const field = error.path[0] as string;
				fieldErrors[field] = error.message;
			});
		} else {
			errorMessages = ['Please fill in all required fields.'];
		}
		return;
	}

	const qty = parseInt(totalPhotos) || 1;
	cart.add({
		id: 'printing-' + Date.now(),
		type: 'service',
		name: 'Printing',
		price: 8 * qty,
		quantity: 1,
		details: result.data
	});
	showToast('Added to cart!');
};
</script>

<div class="flex flex-col max-w-4xl w-full ml-32 mx-auto">
    <div class="flex flex-col items-start mb-12">
        <h2 class="font-spaceGrotesk font-bold text-7xl mb-8">Printing</h2>
        <img src="https://placehold.co/350x250" alt="35mm Film" class="rounded-lg w-[350px] h-[250px] object-cover bg-white mb-8" />
    </div>
    <h2 class="font-spaceGrotesk font-bold text-5xl mb-2">3R to 8R Printing</h2>
    <p class="text-gray-400 text-2xl mb-8">P8</p>
    {#if errorMessages.length}
        <div class="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-5 rounded">
            <ul>
                {#each errorMessages as errMsg}
                    <li>{errMsg}</li>
                {/each}
            </ul>
        </div>
    {/if}

    <form on:submit={handleSubmit} class="w-full flex flex-col gap-6">
        <div>
            <label class="block font-bold mb-2 text-sm">PHOTO SIZE*</label>
            <select 
                class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.photoSize ? 'border-2 border-red-500' : ''}"
                bind:value={photoSize}
                on:change={(e) => handleFieldChange('photoSize', e.currentTarget.value)}
            >
                <option value="">Choose a photo size</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            {#if fieldErrors.photoSize}
                <p class="text-red-500 text-sm mt-1">{fieldErrors.photoSize}</p>
            {/if}
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">TOTAL # OF PHOTOS TO BE PRINTED*</label>
            <input 
                type="text" 
                class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.totalPhotos ? 'border-2 border-red-500' : ''}" 
                placeholder="Enter total number of photos" 
                bind:value={totalPhotos}
                on:input={(e) => handleFieldChange('totalPhotos', e.currentTarget.value)}
            />
            {#if fieldErrors.totalPhotos}
                <p class="text-red-500 text-sm mt-1">{fieldErrors.totalPhotos}</p>
            {/if}
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">ACCESS TO YOUR PHOTOS*</label>
            <select 
                class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.accessPhotos ? 'border-2 border-red-500' : ''}"
                bind:value={accessPhotos}
                on:change={(e) => handleFieldChange('accessPhotos', e.currentTarget.value)}
            >
                <option value="">Select how to access your photos</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            {#if fieldErrors.accessPhotos}
                <p class="text-red-500 text-sm mt-1">{fieldErrors.accessPhotos}</p>
            {/if}
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">LINK TO YOUR PHOTOS (IGNORE IF SENDING A FLASH DRIVE)</label>
            <input 
                type="text" 
                class="w-full px-4 py-2 rounded border border-gray-300 bg-white" 
                placeholder="Paste the link your photos" 
                bind:value={linkPhotos}
            />
        </div>
        <div class="mt-4">
            <label class="block font-bold mb-2 text-sm">MODE OF DELIVERY FOR DROP-OFF*</label>
            <div class="flex flex-col gap-2">
                <label class="text-sm">
                    <input type="radio" name="dropoff" value="same-day" bind:group={dropoffMode} on:change={(e) => { handleFieldChange('dropoffMode', e.currentTarget.value); dropoffOther = ''; }} /> SAME DAY COURIER (LALAMOVE, GRAB, MR. SPEEDY, ETC.)
                </label>
                <label class="text-sm">
                    <input type="radio" name="dropoff" value="courier" bind:group={dropoffMode} on:change={(e) => { handleFieldChange('dropoffMode', e.currentTarget.value); dropoffOther = ''; }} /> COURIER (JRS, LBC, J&T, GOGOEXPRESS, ETC.)
                </label>
                <label class="text-sm">
                    <input type="radio" name="dropoff" value="dropoff" bind:group={dropoffMode} on:change={(e) => { handleFieldChange('dropoffMode', e.currentTarget.value); dropoffOther = ''; }} /> DROP-OFF AT LOCATION (ONE10STUDIOLAB, MUNTINLUPA CITY)
                </label>
                <label class="text-sm">
                    <input type="radio" name="dropoff" value="other" bind:group={dropoffMode} on:change={(e) => handleFieldChange('dropoffMode', e.currentTarget.value)} /> OTHER:
                    {#if dropoffMode === 'other'}
                        <input type="text" class="ml-2 px-2 py-1 rounded border border-gray-300 bg-white inline-block w-40 {fieldErrors.dropoffOther ? 'border-2 border-red-500' : ''}" placeholder="Specify" bind:value={dropoffOther} on:input={(e) => handleFieldChange('dropoffOther', e.currentTarget.value)} />
                        {#if fieldErrors.dropoffOther}
                            <p class="text-red-500 text-sm mt-1">{fieldErrors.dropoffOther}</p>
                        {/if}
                    {/if}
                </label>
            </div>
            {#if fieldErrors.dropoffMode}
                <p class="text-red-500 text-sm mt-1">{fieldErrors.dropoffMode}</p>
            {/if}
        </div>
        <div class="mt-4">
            <label class="block font-bold mb-2 text-sm">MODE OF DELIVERY FOR PICK-UP*</label>
            <div class="flex flex-col gap-2">
                <label class="text-sm">
                    <input type="radio" name="pickup" value="same-day" bind:group={pickupMode} on:change={(e) => { handleFieldChange('pickupMode', e.currentTarget.value); pickupOther = ''; }} /> SAME DAY COURIER (LALAMOVE, GRAB, MR. SPEEDY, ETC.)
                </label>
                <label class="text-sm">
                    <input type="radio" name="pickup" value="courier" bind:group={pickupMode} on:change={(e) => { handleFieldChange('pickupMode', e.currentTarget.value); pickupOther = ''; }} /> COURIER (JRS, LBC, J&T, GOGOEXPRESS, ETC.)
                </label>
                <label class="text-sm">
                    <input type="radio" name="pickup" value="dropoff" bind:group={pickupMode} on:change={(e) => { handleFieldChange('pickupMode', e.currentTarget.value); pickupOther = ''; }} /> DROP-OFF AT LOCATION (ONE10STUDIOLAB, MUNTINLUPA CITY)
                </label>
                <label class="text-sm">
                    <input type="radio" name="pickup" value="other" bind:group={pickupMode} on:change={(e) => handleFieldChange('pickupMode', e.currentTarget.value)} /> OTHER:
                    {#if pickupMode === 'other'}
                        <input type="text" class="ml-2 px-2 py-1 rounded border border-gray-300 bg-white inline-block w-40 {fieldErrors.pickupOther ? 'border-2 border-red-500' : ''}" placeholder="Specify" bind:value={pickupOther} on:input={(e) => handleFieldChange('pickupOther', e.currentTarget.value)} />
                        {#if fieldErrors.pickupOther}
                            <p class="text-red-500 text-sm mt-1">{fieldErrors.pickupOther}</p>
                        {/if}
                    {/if}
                </label>
            </div>
            {#if fieldErrors.pickupMode}
                <p class="text-red-500 text-sm mt-1">{fieldErrors.pickupMode}</p>
            {/if}
        </div>
        <div class="flex gap-4 mt-6 items-center">
            <button type="submit" class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black">Add to cart</button>
        </div>
    </form>
</div> 

<section class="w-full mt-16 flex flex-col md:flex-row">
  <div class="bg-amber-300 flex-1 flex flex-col justify-center items-start py-16 px-10" style="padding-left: 8rem;">
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
  <div class="flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-cover bg-center" style="background-image: url('https://placehold.co/350x250');">
    <h2 class="text-3xl font-bold mb-6 text-black">Got some questions?</h2>
    <a href="/faq" class="bg-amber-300 rounded-4xl px-8 py-3 font-bold text-black text-lg">Read our FAQs</a>
  </div>
</section>
{#if !$user}
<div class="flex justify-between px-40 background-color py-24">
    <div>
        <h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
            <span class="block textOutline text-transparent">Sign up</span> and save
        </h2>
        <p class="text-white font-roboto">Register and Subscribe to get special offers</p>
    </div>
    <a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Register / Log in</a>
</div>
{/if}