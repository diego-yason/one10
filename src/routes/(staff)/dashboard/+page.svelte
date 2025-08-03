<script lang="ts">
	import Logo from '$lib/imgs/logo/black-flask.png';

	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let { pending, paid, completed } = $derived(data);
</script>

<div class="flex flex-col">
	<div class="flex flex-col space-y-6">
		<!-- <p class="font-bold text-2xl flex justify-center">Good day! <br> Employee</p> -->
		<div class="flex justify-center mb-20">
			<div class="bg-white flex justify-center items-center w-60 h-60 rounded-full shadow-2xl">
				<img src={Logo} alt="Logo" />
			</div>
		</div>

		<div class="flex justify-evenly">
			<div
				class="flex flex-col bg-white h-100 w-60 shadow-2xl rounded-3xl items-center space-y-10 hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
			>
				<div class="flex justify-center w-30 h-30 rounded-full bg-yellow-300 mt-10"></div>

				<p class="font-bold py-10">{pending} pending orders</p>
			</div>

			<div
				class="flex flex-col bg-white h-100 w-60 shadow-2xl rounded-3xl items-center space-y-10 hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
			>
				<div class="flex justify-center w-30 h-30 rounded-full bg-green-400 mt-10"></div>

				<p class="font-bold py-10">{paid} paid orders</p>
			</div>

			<div
				class="flex flex-col bg-white h-100 w-60 shadow-2xl rounded-3xl items-center space-y-10 hover:cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
			>
				<div class="flex justify-center w-30 h-30 rounded-full bg-blue-400 mt-10"></div>

				<p class="font-bold py-10">{completed} completed orders</p>
			</div>
		</div>
	</div>
</div>
