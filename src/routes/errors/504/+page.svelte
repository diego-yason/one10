<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={504}
    title="Gateway Timeout"
    message="The server was acting as a gateway and timed out waiting for a response."
    suggestion="Please check your internet connection and try again later."
/>
