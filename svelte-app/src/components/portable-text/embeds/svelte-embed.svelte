<script lang="ts">
  import { fade } from 'svelte/transition';
  import Loader from '$components/loading/spinner.svelte';
  // import { createWorker } from '$lib/embeds/svelte-worker';
  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import type { TypedObject } from '@portabletext/types';
  import type { RouteFetch } from '$types';

  export let portableText: Omit<CustomBlockComponentProps, 'value'> & {
    value: TypedObject & {
      code: {
        code: string;
        language: string;
        filename: string;
      };
    };
  };

  let target: HTMLDivElement,
    active = false,
    loading = false,
    error: string | null = null;

  const showLoader = () => (loading = active = true),
    render = async () => {
      try {
        if (!target || !source) {
          throw new Error('No target or source found');
        }

        const result = await routeFetch('/api/v1/transform/svelte', {
          method: 'POST',
          body: source.replaceAll('\n', '')
        }).then((res) => res.json());

        // TODO: Need to fix bundling of worker, currently need to fix
        // Rollup's node polyfills to get this working in-browser

        // const result = await createWorker()
        //   .bundle(source.replaceAll('\n', ''))
        //   .catch((e) => {
        //     throw new Error(e);
        //   });

        if (result.error) {
          throw new Error(result.error);
        }

        // eslint-disable-next-line no-eval
        const componentConstructor = eval(
          result.code.replace(/^var.*?=\s*/, '').replace(/;\s*$/, '')
        );

        target.attachShadow({ mode: 'open' });

        const styles = document.createElement('style');
        styles.textContent = ':host{all:initial;}';
        target.shadowRoot?.appendChild(styles);

        new componentConstructor({ target: target?.shadowRoot });

        loading = false;
      } catch (e: unknown) {
        console.error(e);
        active = false;
        error = (e as Error)?.message || 'Unknown compile error';
      }
    };

  $: ({ code: source, filename: _fileName } = portableText.value.code);
  $: if (target && source) {
    render();
  }
  $: routeFetch =
    (portableText.global.context as { routeFetch?: RouteFetch }).routeFetch ||
    fetch;
</script>

<div class="target-container" class:active>
  {#if !active || error}
    <div class="hidden-bg" transition:fade={{ duration: 250 }}>
      <div />
      {#if error}
        <p>{error}</p>
      {:else}
        <button class="focusOutline-sm" on:click={showLoader}
          >Render Svelte</button
        >
      {/if}
    </div>
  {:else}
    <div
      class="svelte-target-container"
      transition:fade={{ duration: 250, delay: 250 }}
    >
      {#if loading}
        <div class="loader">
          <Loader />
        </div>
      {/if}
      <div bind:this={target} />
    </div>
  {/if}
</div>

<style lang="scss">
  .target-container {
    @apply relative mt-6 mb-8 h-[10rem] w-full transition-[height] duration-200;

    &.active {
      height: fit-content;
    }
  }

  .hidden-bg {
    @apply relative h-full w-full;

    > div {
      @apply h-full w-full bg-stone-300 bg-opacity-50 blur-md;

      + button {
        @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded px-4 py-2 font-code font-medium text-stone-800 decoration-violet-400 decoration-2 underline-offset-[6px];

        &:hover,
        &:focus-visible {
          @apply underline;
        }
      }
      + p {
        @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-4 py-2 font-code font-medium text-stone-800;
      }
    }
  }

  .svelte-target-container {
    @apply relative h-full overflow-x-hidden overflow-y-scroll;

    div {
      &:not(.loader) {
        @apply w-full;
      }
      &.loader {
        @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform;
      }
    }
  }

  :global(.dark) {
    .hidden-bg {
      > div {
        @apply bg-stone-700 bg-opacity-40;

        + button,
        + p {
          @apply text-stone-100;
        }
      }
    }
  }
</style>
