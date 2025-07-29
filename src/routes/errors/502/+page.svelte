<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={502}
    title="Bad Gateway"
    message="Our server received an invalid response from an upstream server."
    suggestion="This is usually a temporary issue. Please try again in a few moments."
/>
