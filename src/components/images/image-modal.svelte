<script lang="ts">
  import { BASE_ANIMATION_DURATION, prefersReducedMotion } from '$lib/transitions';
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let {
    show = $bindable(false),
    children,
  }: {
    show?: boolean;
    children?: Snippet;
  } = $props();

  let closeButton: HTMLSpanElement | undefined = $state();

  // Space closes on keyup so the keydown that opened the modal (Enter/Space on
  // the inline image button) can't immediately dismiss it.
  const onKeyUp = (e: KeyboardEvent) => {
    if (!show) {
      return;
    }
    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();
      show = false;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!show) {
      return;
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      show = false;
      return;
    }
    if (e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
      closeButton?.focus();
    }
  };

  // The page must not scroll behind the fullscreen dialog.
  $effect(() => {
    if (!show) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  });
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

{#if show}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <dialog
    class="fixed inset-0 z-50 flex h-full w-full cursor-zoom-out flex-col items-center justify-center bg-transparent"
    onclick={() => (show = false)}
    onkeydown={onKeyDown}
    onkeyup={onKeyUp}
  >
    <!-- Fade the backdrop only: the dialog itself must not fade, or its opacity
         masks the image's zoom morph while it travels. -->
    <div
      class="absolute inset-0 bg-black/80"
      aria-hidden="true"
      in:fade={{ duration: BASE_ANIMATION_DURATION }}
      out:fade={{ duration: BASE_ANIMATION_DURATION }}
    ></div>
    <span
      class="text-dark dark:text-light absolute top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-14 cursor-pointer rounded-xs bg-neutral-100/85 px-4 py-2 text-sm font-bold backdrop-blur-md transition-[translate,background-color,color,scale] focus-visible:translate-y-4 active:scale-[0.97] dark:bg-neutral-600/85 print:hidden"
      role="button"
      aria-label="Close"
      tabindex="0"
      in:fly={{
        delay: 100,
        duration: BASE_ANIMATION_DURATION / 3,
        y: prefersReducedMotion() ? 0 : -40,
      }}
      out:fly={{
        duration: BASE_ANIMATION_DURATION / 3,
        y: prefersReducedMotion() ? 0 : 40,
      }}
      onkeyup={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
          show = false;
        }
      }}
      bind:this={closeButton}
    >
      Close
    </span>
    <div
      class="relative flex h-full max-h-full w-full max-w-full flex-col items-center justify-center p-8"
    >
      {@render children?.()}
    </div>
  </dialog>
{/if}
