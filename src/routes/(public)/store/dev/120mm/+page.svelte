<script lang="ts">
	import { user, isStaff } from '$lib/stores/auth';
	import { film120mmSchema, validateField } from '$lib/validation';
	import { add, cart, showToast } from '$lib/stores/cart';

	let pushProcessing = 1;
	let filmBrand = '';
	let processType = '';
	let returningNegatives = '';
	let scanOption = '';
	let errorMessages: string[] = [];
	let fieldErrors: Record<string, string> = {};

	// Real-time validation function
	function handleFieldChange(field: string, value: string) {
		// Clear general errors when user starts typing
		if (errorMessages.length > 0) {
			errorMessages = [];
		}

		// Validate the specific field
		const error = validateField(
			film120mmSchema,
			field as keyof typeof film120mmSchema.shape,
			value
		);
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

		const result = film120mmSchema.safeParse({
			filmBrand,
			processType,
			returningNegatives,
			scanOption
		});

		if (!result.success) {
			if (result.error && Array.isArray(result.error.errors)) {
				// Group errors by field
				result.error.errors.forEach((error) => {
					const field = error.path[0] as string;
					fieldErrors[field] = error.message;
				});
			} else {
				errorMessages = ['Please fill in all required fields.'];
			}
			return;
		}

		const price = scanOption === 'scan' ? 300 : 200;
		add({
			id: '120mm',
			name: '120mm Film',
			price,
			quantity: 1,
			// TODO: blank data
			details: result.data,
			// TODO: blank data
			imageUrl: ''
		});
		showToast('Added to cart!');
	};
</script>

<div class="flex flex-col max-w-4xl w-full ml-32 mx-auto">
	<div class="flex flex-col items-start mb-12">
		<h2 class="font-spaceGrotesk font-bold text-7xl mb-8">
			Develop <span class="textOutline text-transparent">+ Scanning</span>
		</h2>
		<img
			src="https://placehold.co/350x250"
			alt="35mm Film"
			class="rounded-lg w-[350px] h-[250px] object-cover bg-white mb-8"
		/>
	</div>
	<h2 class="font-spaceGrotesk font-bold text-5xl mb-2">120MM FILM</h2>
	<p class="text-gray-400 text-2xl mb-8">P200</p>
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
			<label class="block font-bold mb-2 text-sm"
				>FILM BRAND NAME (TYPE 'GENERIC' IF NO BRAND)*</label
			>
			<input
				type="text"
				class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.filmBrand
					? 'border-2 border-red-500'
					: ''}"
				placeholder="Type your film's brand name"
				bind:value={filmBrand}
				on:input={(e) => handleFieldChange('filmBrand', e.currentTarget.value)}
			/>
			{#if fieldErrors.filmBrand}
				<p class="text-red-500 text-sm mt-1">{fieldErrors.filmBrand}</p>
			{/if}
		</div>
		<div>
			<label class="block font-bold mb-2 text-sm">PROCESS TYPE</label>
			<select
				class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.processType
					? 'border-2 border-red-500'
					: ''}"
				bind:value={processType}
				on:change={(e) => handleFieldChange('processType', e.currentTarget.value)}
			>
				<option value="">Select process type</option>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
				<option value="option3">Option 3</option>
			</select>
			{#if fieldErrors.processType}
				<p class="text-red-500 text-sm mt-1">{fieldErrors.processType}</p>
			{/if}
		</div>
		<div>
			<label class="block font-bold mb-2 text-sm">PUSH PROCESSING</label>
			<div class="flex items-center gap-4">
				<input type="range" min="1" max="3" step="1" bind:value={pushProcessing} class="w-40" />
				<span class="font-bold">{pushProcessing}</span>
			</div>
		</div>
		<div>
			<label class="block font-bold mb-2 text-sm">RETURNING NEGATIVES</label>
			<select
				class="w-full px-4 py-2 rounded border border-gray-300 bg-white {fieldErrors.returningNegatives
					? 'border-2 border-red-500'
					: ''}"
				bind:value={returningNegatives}
				on:change={(e) => handleFieldChange('returningNegatives', e.currentTarget.value)}
			>
				<option value="">Select how would you like to get your negatives back</option>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
				<option value="option3">Option 3</option>
			</select>
			{#if fieldErrors.returningNegatives}
				<p class="text-red-500 text-sm mt-1">{fieldErrors.returningNegatives}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2 mt-2">
			<label class="text-sm">
				<input
					type="radio"
					name="scanOption"
					value="scan"
					bind:group={scanOption}
					on:change={(e) => handleFieldChange('scanOption', e.currentTarget.value)}
				/>
				SCAN FILM AND EMAIL ME SOFT COPIES +P100.00
			</label>
			<label class="text-sm">
				<input
					type="radio"
					name="scanOption"
					value="process"
					bind:group={scanOption}
					on:change={(e) => handleFieldChange('scanOption', e.currentTarget.value)}
				/>
				PROCESS ONLY (I WILL SCAN AND PRINT ON MY OWN)
			</label>
		</div>
		{#if fieldErrors.scanOption}
			<p class="text-red-500 text-sm mt-1">{fieldErrors.scanOption}</p>
		{/if}
		<div class="flex gap-4 mt-6 items-center">
			<button type="submit" class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black"
				>Add to cart</button
			>
		</div>
	</form>
</div>

<section class="w-full mt-16 flex flex-col md:flex-row">
	<div
		class="bg-amber-300 flex-1 flex flex-col justify-center items-start py-16 px-10"
		style="padding-left: 8rem;"
	>
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
	<div
		class="flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-cover bg-center"
		style="background-image: url('https://placehold.co/350x250');"
	>
		<h2 class="text-3xl font-bold mb-6 text-black">Got some questions?</h2>
		<a href="/faq" class="bg-amber-300 rounded-4xl px-8 py-3 font-bold text-black text-lg"
			>Read our FAQs</a
		>
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
		<a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center"
			>Register / Log in</a
		>
	</div>
{/if}
