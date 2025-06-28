<script lang="ts">
	export let show = false;
	export let message = 'Are you sure?';
	export let confirmText = 'Delete';
	export let cancelText = 'Cancel';
	export let onConfirm: () => void;
	export let onCancel: () => void;

	// Prevent background scroll when modal is open
	$: {
		if (typeof window !== 'undefined') {
			document.body.style.overflow = show ? 'hidden' : '';
		}
	}
</script>

{#if show}
	<div class="modal-overlay">
		<div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
			<!-- Optional warning icon -->
			<svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0ZM12 7v4m0 4h.01"/></svg>
			<div class="text-lg font-semibold text-gray-800 mb-4 text-center">{message}</div>
			<div class="flex gap-4 mt-2 w-full justify-center">
				<button class="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors" on:click={onCancel}>{cancelText}</button>
				<button class="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors" on:click={onConfirm}>{confirmText}</button>
			</div>
		</div>
	</div>
{/if}

<style>
.modal-overlay {
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0,0,0,0.5);
}
</style> 