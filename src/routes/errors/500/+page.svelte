<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={500}
    title="Internal Server Error"
    message="Something went wrong on our end. Our team has been notified."
    suggestion="Please try again later or try a different action."
/>
