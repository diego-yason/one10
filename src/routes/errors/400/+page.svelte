<script>
    import ErrorPage from '../errors/ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={400}
    title="Bad Request"
    message="The request could not be understood by the server due to malformed syntax."
    suggestion="Please check your request parameters and try again."
/>
