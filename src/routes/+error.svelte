<script lang="ts">
    import { page } from '$app/state';
    import ErrorPage from './errors/ErrorPage.svelte';
    
    $: statusCode = $page.status;
    $: errorMessage = $page.error?.message || '';
    
    // Define default error messages for common status codes
    const errorInfo = {
        400: {
            title: "Bad Request",
            message: "The request could not be understood by the server due to malformed syntax.",
            suggestion: "Please check your request parameters and try again."
        },
        401: {
            title: "Unauthorized",
            message: "You need to be authenticated to access this resource.",
            suggestion: "Please log in to continue."
        },
        403: {
            title: "Forbidden",
            message: "You don't have permission to access this resource.",
            suggestion: "You may not have the necessary permissions for this action."
        },
        404: {
            title: "Not Found",
            message: "The page you are looking for does not exist or has been moved.",
            suggestion: "Please check the URL or click Go Back to return to the previous page."
        },
        500: {
            title: "Internal Server Error",
            message: "Something went wrong on our end. Our team has been notified.",
            suggestion: "Please try again later or try a different action."
        },
        502: {
            title: "Bad Gateway",
            message: "Our server received an invalid response from an upstream server.",
            suggestion: "This is usually a temporary issue. Please try again in a few moments."
        },
        503: {
            title: "Service Unavailable",
            message: "Our service is temporarily unavailable due to maintenance or high traffic.",
            suggestion: "Please try again in a few moments."
        },
        504: {
            title: "Gateway Timeout",
            message: "The server was acting as a gateway and timed out waiting for a response.",
            suggestion: "Please check your internet connection and try again later."
        }
    };
    
    $: errorDetails = errorInfo[statusCode] || {
        title: "Error",
        message: errorMessage || "An unexpected error occurred.",
        suggestion: "Please try again or try a different action."
    };
</script>

<ErrorPage 
    statusCode={statusCode}
    title={errorDetails.title}
    message={errorDetails.message}
    suggestion={errorDetails.suggestion}
/>
