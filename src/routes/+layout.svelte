<script lang="ts">
	import '$lib/firebase'; // initialize Firebase

	let { children } = $props();
	import '../app.css';
</script>

{@render children()}
