<script lang="ts">
	let { children } = $props();
</script>

<nav class="flex justify-between py-10 px-32 font-poppins">
	<div class="flex flex-row gap-20 items-center">
		<a href="/">
			<img src="https://placehold.co/100x60" alt="" />
		</a>
		<a href="#">Home</a>
		<a href="#">Services</a>
		<a href="#">Track</a>
		<a href="#">FAQs</a>
	</div>
	<div class="flex flex-row gap-14 items-center">
		<a href="#">Cart</a>
		<a href="#">Log In</a>
	</div>
</nav>

{@render children()}
