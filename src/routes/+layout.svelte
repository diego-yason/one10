<script lang="ts">
	import { initializeFirebase } from '$lib/firebase'; // initialize Firebase
	initializeFirebase();

	let { children } = $props();
	import '../app.css';
</script>

{@render children()}
