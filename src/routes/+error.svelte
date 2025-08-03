<script lang="ts">
	import { page } from '$app/state';

	// Define default error messages for common status codes
	const errorInfo = {
		400: {
			title: 'Bad Request',
			message: 'The request could not be understood by the server due to malformed syntax.',
			suggestion: 'Please check your request parameters and try again.'
		},
		401: {
			title: 'Unauthorized',
			message: 'You need to be authenticated to access this resource.',
			suggestion: 'Please log in to continue.'
		},
		403: {
			title: 'Forbidden',
			message: "You don't have permission to access this resource.",
			suggestion: 'You may not have the necessary permissions for this action.'
		},
		404: {
			title: 'Not Found',
			message: 'The page you are looking for does not exist or has been moved.',
			suggestion: 'Please check the URL or click Go Back to return to the previous page.'
		},
		500: {
			title: 'Internal Server Error',
			message: 'Something went wrong on our end.',
			suggestion:
				'Please try again later or try a different action. Inform support if the issue persists.'
		},
		502: {
			title: 'Bad Gateway',
			message: 'Our server received an invalid response from an upstream server.',
			suggestion: 'This is usually a temporary issue. Please try again in a few moments.'
		},
		503: {
			title: 'Service Unavailable',
			message: 'Our service is temporarily unavailable due to maintenance or high traffic.',
			suggestion: 'Please try again in a few moments.'
		},
		504: {
			title: 'Gateway Timeout',
			message: 'The server was acting as a gateway and timed out waiting for a response.',
			suggestion: 'Please check your internet connection and try again later.'
		}
	};

	const { title, message, suggestion } = errorInfo[page.status as keyof typeof errorInfo] || {
		title: 'Unknown Error',
		message: 'An unexpected error occurred. Please try again later.',
		suggestion: 'If the problem persists, please contact support.'
	};
</script>

<div class="min-h-screen flex items-center justify-center py-20 px-6">
	<div class="max-w-3xl w-full text-center">
		<h1 class="font-spaceGrotesk font-bold text-9xl text-amber-300 mb-6">
			{page.status}
		</h1>
		<h2 class="font-spaceGrotesk text-4xl text-white font-bold mb-6">
			<span class="textOutline text-transparent">Error</span>
			{title}
		</h2>
		<p class="font-roboto text-white text-xl mb-8">
			{message}
		</p>
		<p class="font-roboto text-gray-300 mb-12">
			{suggestion}
		</p>

		<div class="flex justify-center">
			<button
				onclick={() => history.back()}
				class="border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-colors rounded-4xl px-8 py-3"
			>
				Go Back
			</button>
		</div>
	</div>
</div>
