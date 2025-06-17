<script lang="ts">
	let count = $state(1);
</script>

<img
	src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
	alt=""
	class="w-1/4 rounded-lg m-5"
/>
<div class="flex-col text-left space-y-35">
	<div>
		<h6 class="m-5 font-spaceGrotesk font-bold">Disposable Camera Service</h6>
		<p class="m-5">Film Format: 35mm</p>
	</div>
	<div>
		<div class="flex border-1 w-20 m-5 rounded-lg justify-around">
			<button
				class="px-1.5 basis-1/4 py-3 border-r-[1px] border-black"
				onclick={() => count--}
				disabled={count <= 0}>-</button
			>
			<span class="grow flex items-center justify-center">{count}</span>
			<button class="px-1.5 basis-1/4 py-3 border-l-[1px] border-black" onclick={() => count++}
				>+</button
			>
		</div>
		<h6 class="text-left m-5 font-bold">P250</h6>
	</div>
</div>
