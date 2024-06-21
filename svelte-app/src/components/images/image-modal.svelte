<script lang="ts">
  import { fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let dialog: HTMLDialogElement,
    show = false;
</script>

<svelte:window
  on:keydown={(e) => {
    if (show) {
      switch (e.key) {
        case 'Escape':
          show = false;
          break;
        case 'Tab':
          e.preventDefault();
          dialog.focus();
          break;
      }
    }
  }}
/>

{#if show}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog
    class="fixed inset-0 z-50 flex h-full w-full cursor-zoom-out flex-col items-center justify-center bg-black/80"
    bind:this={dialog}
    on:click={() => (show = false)}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        show = false;
      }
    }}
    in:fade={{ duration: BASE_ANIMATION_DURATION }}
    out:fade={{ duration: BASE_ANIMATION_DURATION }}
  >
    <div
      class="relative flex h-full max-h-full w-full max-w-full flex-col items-center justify-center p-8"
    >
      <slot />
    </div>
  </dialog>
{/if}
