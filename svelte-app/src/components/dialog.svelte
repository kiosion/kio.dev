<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  import { t } from '$i18n';

  import {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle
  } from '@rgossiaux/svelte-headlessui';

  const dispatch = createEventDispatcher();

  export let title: string,
    description: string,
    open: boolean,
    hideCancel = false,
    cancelText = 'Cancel',
    confirmText = 'Confirm';

  const onCancel = () => {
      dispatch('close');
    },
    onConfirm = () => {
      dispatch('confirm');
    };
</script>

<Dialog {open} on:close={onCancel} class="hui-dialog">
  <span class="sr-only">Dialog</span>
  <div transition:fade={{ duration: 200 }}>
    <DialogOverlay class="hui-dialog-overlay" />
  </div>

  <div
    class="hui-dialog-contents"
    transition:scale={{ duration: 150, delay: 50, start: 0.9 }}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>{description}</DialogDescription>

    <slot />

    <div class="hui-dialog-actions">
      <button class="focusOutline-sm" on:click={onConfirm}>{$t(confirmText)}</button>
      {#if !hideCancel}
        <button class="focusOutline-sm" on:click={onCancel}>{$t(cancelText)}</button>
      {/if}
    </div>
  </div>
</Dialog>

<style lang="scss">
  :global(.hui-dialog) {
    @apply fixed bottom-0 left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center overflow-x-hidden;
  }

  :global(.hui-dialog-overlay) {
    @apply fixed left-0 top-0 z-[5] h-[100vh] w-[100vw] bg-light opacity-40 backdrop-blur-sm;
  }
  :global(.dark .hui-dialog-overlay) {
    @apply bg-dark opacity-40;
  }

  :global(.hui-dialog-contents) {
    @apply relative z-[5] m-4 flex max-w-lg flex-col items-start justify-between gap-4 rounded-lg bg-white p-6 shadow-[0_0_20px_-2px_var(--tw-shadow)] shadow-dark/20;
  }
  :global(.dark .hui-dialog-contents) {
    @apply bg-gray shadow-gray;
  }

  :global(.hui-dialog-contents h2) {
    @apply text-lg font-medium text-dark;
  }
  :global(.dark .hui-dialog-contents h2) {
    @apply text-light;
  }
  :global(.hui-dialog-contents p) {
    @apply max-w-sm text-base text-dark/90;
  }
  :global(.dark .hui-dialog-contents p) {
    @apply text-light/90;
  }

  .hui-dialog-actions {
    @apply -mb-2 mt-2 flex w-full justify-start gap-5 border-t border-t-dark/40 pt-3;
  }
  :global(.dark .hui-dialog-actions) {
    @apply border-t-light/40;
  }

  button {
    @apply rounded-lg px-3 py-1 font-code font-medium text-dark decoration-accent-light decoration-2 underline-offset-[6px];

    &:hover,
    &:focus-visible {
      @apply underline;
    }
  }
  :global(.dark) {
    button {
      @apply text-light decoration-accent-dark;
    }
  }
</style>
