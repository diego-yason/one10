<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
</script>

<nav class="flex justify-between py-10 px-32 font-poppins text-white w-full absolute">
	<div class="flex flex-row gap-20 items-center">
		<a href="/">
			<img src="https://placehold.co/100x60" alt="" />
		</a>
		<a href="/" class:font-semibold={page.url.pathname === '/'}>Home</a>
		<a href="#">Services</a>
		<a href="#">Track</a>
		<a href="/faq">FAQs</a>
	</div>
	<div class="flex flex-row gap-14 items-center">
		<a href="/cart">Cart</a>
		<a href="/login">Log In</a>
	</div>
</nav>

{@render children()}

<!-- footer -->
<footer
	class="bg-[#333] font-roboto text-[#7A7A7A] flex flex-row justify-between pt-12 pb-20 px-44"
>
	<p>One 10 Studio Lab | Muntinlupa City, Metro Manila</p>
	<p>
		Copyright © 2025, <span class="text-amber-300">One 10 Studio Lab</span> | All rights reserved.
	</p>
</footer>
