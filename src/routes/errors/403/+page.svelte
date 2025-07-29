<script>
    import ErrorPage from '../ErrorPage.svelte';
</script>

<ErrorPage 
    statusCode={403}
    title="Forbidden"
    message="You don't have permission to access this resource."
    suggestion="You may not have the necessary permissions for this action."
/>
