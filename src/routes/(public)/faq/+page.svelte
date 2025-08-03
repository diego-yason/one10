<script lang="ts">
	import { slide } from 'svelte/transition';

	let faqs = [
		{
			question: 'How do I place an order?',
			answer: 'Placing an order is simple and convenient. Just visit our website and click on the Store section where you will find all our available services. Browse through our film processing options, select what you need, and follow the easy step-by-step ordering process. You will be able to specify your preferences, choose your preferred drop-off location, and complete your order entirely online.',
			open: false
		},
		{
			question: 'How do I pay for my order?',
			answer: 'We have made payment hassle-free with our secure online payment system. Once you have placed your order through our Store section, you can pay immediately using your preferred online payment method. The system will process your payment securely and provide instant confirmation, so you will know your order is confirmed right away without any waiting period.',
			open: false
		},
		{
			question: 'How do I send my film?',
			answer: 'After placing and paying for your order online, you will need to physically send your film to one of our four convenient drop-off locations: Malate Manila, Sta. Ana Manila, Muntinlupa City (our main lab), or Sta. Rosa Laguna. Choose the location that is most convenient for you. Please note that you will be responsible for the shipping cost to get your film to your chosen drop-off point. Keep in mind that films dropped off at locations other than our Muntinlupa lab will be forwarded there weekly, and your order processing officially begins once your film reaches our main laboratory.',
			open: false
		},
		{
			question: 'How long does the process take?',
			answer: 'Our film processing follows a reliable schedule where we handle films in batches every 2-3 days. Once your film reaches our Muntinlupa lab, it will be included in the next available processing batch. The great news is that you can track the progress of your order in real-time through our website, so you will always know exactly where your film is in the process - from when we receive it, through processing and scanning, until it is completed and ready for delivery.',
			open: false
		}
	];

	function open(index: number) {
		faqs[index].open = !faqs[index].open;
	}
</script>

<div class="flex items-center flex-col space-y-24 min-h-screen py-12">
	<h1 class="title">Frequently Asked Questions</h1>

	<div class="flex flex-col space-y-5 w-full max-w-4xl">
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
		width: 100%;
		max-width: 50rem;
		padding: 0.9375rem 1.25rem 1rem 1.25rem;
	}
</style>
