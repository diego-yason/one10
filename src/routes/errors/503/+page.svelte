<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={503}
    title="Service Unavailable"
    message="Our service is temporarily unavailable due to maintenance or high traffic."
    suggestion="Please try again in a few moments."
/>
