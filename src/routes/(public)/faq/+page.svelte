<script lang="ts">
	import { slide } from 'svelte/transition';

	let faqs = [
		{
			question: 'How do I place an order?',
			answer: 'blabla',
			open: false
		},
		{
			question: 'How do I pay for my order?',
			answer: '',
			open: false
		},
		{
			question: 'How do I send my film?',
			answer: '',
			open: false
		},
		{
			question: 'How long does the process take?',
			answer: '',
			open: false
		}
	];

	function open(index: number) {
		faqs[index].open = !faqs[index].open;
	}
</script>

<div class="flex items-center flex-col space-y-24 h-[70rem]">
	<h1 class="title">Frequently Asked Questions</h1>

	<div class="flex flex-col space-y-5">
		{#each faqs as faq, i}
			<div class="container bg-white" on:click={() => open(i)}>
				<div class="flex items-center justify-between">
					<p class="font-style">{faq.question}</p>
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="16"
							viewBox="0 0 15 16"
							fill="none"
							class="hover:cursor-pointer"
						>
							<g clip-path="url(#clip0_1018_92)">
								<path
									d="M15 6.4375H9.0625V0.5H5.9375V6.4375H0V9.5625H5.9375V15.5H9.0625V9.5625H15V6.4375Z"
									fill="#6C5CCC"
								/>
							</g>
							<defs>
								<clipPath id="clip0_1018_92">
									<rect width="15" height="15" fill="white" transform="translate(0 0.5)" />
								</clipPath>
							</defs>
						</svg>
					</span>
				</div>

				{#if faq.open}
					<p class="mt-5 text-gray-600" transition:slide>{faq.answer}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

<svelte:head>
	<title>FAQs | One10 Studio Labs</title>
</svelte:head>

<style>
	.title {
		color: var(--Gray-1, #333);
		/* Headings/h1 */
		font-family: 'Space Grotesk';
		font-size: 5rem;
		font-style: normal;
		font-weight: 700;
		line-height: 5.5rem; /* 110% */
		letter-spacing: -0.1rem;
	}

	.font-style {
		color: var(--Gray-1, #333);
		/* H2 */
		font-family: Inter;
		font-size: 1.125rem;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
	}

	.container {
		width: 30.25rem;
		padding: 0.9375rem 1.25rem 1rem 1.25rem;
	}
</style>
