<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { TypedObject } from '@portabletext/types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: TypedObject & {
      url: string;
    };
  };

  let active = false;

  const toggleOpen = () => (active = !active);

  $: embedUrl = portableText.value.url;
  $: urlIsValid = embedUrl.match(/https:\/\/replit\.com\/@[\w-]+\/[\w-]+/);
</script>

<div class="rich-embed" class:active>
  {#if !active || !urlIsValid}
    <div class="hidden-bg" transition:fade={{ duration: 250 }}>
      <div />
      {#if !urlIsValid}
        <button disabled>Error - Invalid URL</button>
      {:else}
        <button class="focusOutline-sm" on:click={toggleOpen}>Load Repl</button>
      {/if}
    </div>
  {:else}
    <div class="container" transition:fade={{ duration: 250, delay: 250 }}>
      <iframe
        src={embedUrl + '?embed=true'}
        width="100%"
        height="100%"
        frameborder="0"
        title=""
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .rich-embed {
    @apply relative mt-6 mb-8 h-[10rem] w-full transition-[height] duration-200;

    &.active {
      @apply h-[30rem];
    }

    .hidden-bg {
      @apply relative h-full w-full;

      div {
        @apply h-full w-full bg-stone-300 bg-opacity-50 blur-md;

        + button {
          @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded px-4 py-2 font-code font-medium text-stone-800 decoration-violet-400 decoration-2 underline-offset-[6px];

          &:hover,
          &:focus-visible {
            &:not(:disabled) {
              @apply underline;
            }
            &:disabled {
              @apply cursor-not-allowed;
            }
          }
        }
      }
    }

    .container {
      @apply relative h-full overflow-hidden;

      iframe {
        @apply absolute top-0 left-0 h-full w-full rounded-md;
      }
    }
  }

  :global(.dark) {
    .rich-embed {
      .hidden-bg {
        div {
          @apply bg-stone-700 bg-opacity-40;

          + button {
            @apply text-stone-100;
          }
        }
      }
    }
  }
</style>
