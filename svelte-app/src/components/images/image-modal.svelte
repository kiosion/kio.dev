<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';

  import type { Snippet } from 'svelte';

  let {
    dialog = $bindable<HTMLDialogElement>(),
    show = $bindable(false),
    children
  }: { dialog: HTMLDialogElement; show?: boolean; children?: Snippet } = $props();

  let closeButton = $state<HTMLSpanElement>();

  const onKeyUp = (e: KeyboardEvent) => {
      if (!show) {
        return;
      }
      if (e.key === ' ' || e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        show = false;
      }
    },
    onKeyDown = (e: KeyboardEvent) => {
      if (!show || e.key !== 'Tab') {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      closeButton?.focus();
    };
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

{#if show}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <dialog
    class="fixed inset-0 z-50 flex h-full w-full cursor-zoom-out flex-col items-center justify-center bg-black/80"
    bind:this={dialog}
    onclick={() => (show = false)}
    onkeydown={onKeyDown}
    onkeyup={onKeyUp}
    in:fade={{ duration: BASE_ANIMATION_DURATION }}
    out:fade={{ duration: BASE_ANIMATION_DURATION }}
  >
    <span
      class="focus-outline-sm absolute left-1/2 top-0 z-50 -mt-14 -translate-x-1/2 cursor-pointer rounded-xs bg-neutral-100 px-4 py-2 text-sm font-bold text-dark transition-[margin-top,background-color,color] focus-visible:mt-4 dark:bg-neutral-600 dark:text-light print:hidden"
      role="button"
      aria-label={$t('Close')}
      tabindex="0"
      in:fly={{ delay: 100, duration: BASE_ANIMATION_DURATION / 3, y: -40 }}
      out:fly={{ duration: BASE_ANIMATION_DURATION / 3, y: 40 }}
      onkeyup={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
          show = false;
        }
      }}
      bind:this={closeButton}
    >
      {$t('Close')}
    </span>
    <div
      class="relative flex h-full max-h-full w-full max-w-full flex-col items-center justify-center p-8"
    >
      {@render children?.()}
    </div>
  </dialog>
{/if}
