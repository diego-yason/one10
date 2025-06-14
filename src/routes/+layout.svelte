<script lang="ts">
	import { firebase } from '$lib/firebase'; // initialize Firebase
	firebase.getFirebaseApp();

	let { children } = $props();
	import '../app.css';
</script>

{@render children()}
