<script>
    import ErrorPage from '../errors/ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={404}
    title="Not Found"
    message="The page you are looking for does not exist or has been moved."
    suggestion="Please check the URL or click Go Back to return to the previous page."
/>
