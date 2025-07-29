<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={401}
    title="Unauthorized"
    message="You need to be authenticated to access this resource."
    suggestion="Please log in to continue."
/>
