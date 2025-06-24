<script lang="ts">
	let count = $state(1);

	const { item }: {
		item: {
			type: string;
			name: string;
			quantity: number;
			price: number;
		};
	} = $props();


</script>

<img
	src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
	alt=""
	class="w-1/4 rounded-lg m-5"
/>
<div class="flex-col text-left space-y-35">
	<div>
		<h6 class="m-5 font-spaceGrotesk font-bold">{item.type}</h6>
		<p class="m-5">{item.name}</p>
	</div>
	<div>
		<div class="flex border-1 w-20 m-5 rounded-lg justify-around">
			<button
				class="px-1.5 basis-1/4 py-3 border-r-[1px] border-black"
				onclick={() => {item.quantity--}}
				disabled={item.quantity <= 0}>-</button
			>
			<span class="grow flex items-center justify-center">{item.quantity}</span>
			<button class="px-1.5 basis-1/4 py-3 border-l-[1px] border-black" onclick={() => item.quantity++}
				>+</button
			>
		</div>
		<h6 class="text-left m-5 font-bold">P{item.price}</h6>
	</div>
</div>
