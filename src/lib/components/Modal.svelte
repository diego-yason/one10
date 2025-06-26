<script lang="ts">
  export let show: boolean;
  export let onClose: () => void;

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      onClose();
    }
  }
</script>

{#if show}
  <button
    class="fixed inset-0 backdrop-blur-sm bg-opacity-40 z-40 cursor-default"
    aria-label="Close modal"
    on:click={onClose}
    on:keydown={handleKeydown}
  ></button>

  <div class="fixed right-0 top-0 h-full w-[400px] bg-neutral-600 shadow-2xl z-50 p-6 overflow-y-auto rounded-l-2xl">
    <button
      class="absolute top-4 right-6 text-gray-500 text-xl hover:text-black"
      on:click={onClose}
      aria-label="Close panel"
    >
      ✕
    </button>
    <slot />
  </div>
{/if}
