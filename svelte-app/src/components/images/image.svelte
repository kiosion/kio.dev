<script lang="ts">
  import { onMount } from 'svelte';
  import { crossfade, fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { buildImageUrl, getCrop } from '$lib/sanity';

  import ImageModal from '$components/images/image-modal.svelte';
  import Spinner from '$components/loading/spinner.svelte';

  import type { RouteFetch, SanityImageObject } from '$types';

  export let image: SanityImageObject,
    routeFetch: RouteFetch,
    placeholder: string | undefined = undefined,
    crop: SanityImageObject['crop'] & { width: number; height: number } = getCrop(image),
    srcPromise: Promise<string> | undefined = undefined;

  const { _key } = image,
    { _ref } = image.asset,
    imgDimensions = {
      width: Math.min(crop.width, 1200),
      height: Math.min(crop.width, 1200) * (crop.height / crop.width)
    },
    placeholderSrc =
      placeholder || buildImageUrl({ ref: _ref, crop, width: 30, blur: 40 }),
    style = `max-width: ${imgDimensions.width}px; max-height: ${imgDimensions.height}px; aspect-ratio: ${imgDimensions.width} / ${imgDimensions.height};`,
    [send, receive] = crossfade({
      duration: (d: number) => Math.sqrt(d * 200),
      fallback(node, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
          duration: 300,
          easing: params.easing,
          css: (t) => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `
        };
      }
    });

  let fullSrc: string,
    dialog: HTMLDialogElement,
    showImageModal = false;

  onMount(() => {
    srcPromise ||= routeFetch(
      buildImageUrl({ ref: _ref, crop, width: imgDimensions.width })
    ).then(async (res) => {
      const mimeType =
          res.headers.get('content-type') ||
          res.headers.get('Content-Type') ||
          'image/jpeg',
        ab = await res.arrayBuffer(),
        buf = new Uint8Array(ab).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        );
      return `data:${mimeType};base64,${btoa(buf)}`;
    });

    srcPromise.then((res) => (fullSrc = res));
  });
</script>

<div>
  {#await srcPromise || new Promise((_res) => {})}
    <div class="loading"><Spinner /></div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={placeholderSrc} draggable="false" {style} />
  {:then src}
    <button
      {style}
      on:click={() => {
        showImageModal = true;
      }}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          showImageModal = true;
        }
      }}
    >
      {#if showImageModal}
        <img
          class="placeholder"
          src={placeholderSrc}
          alt={_key}
          draggable="false"
          {style}
          out:fade={{ duration: BASE_ANIMATION_DURATION }}
        />
      {:else}
        <img
          {src}
          alt={_key}
          draggable="false"
          in:receive={{ key: _key, duration: BASE_ANIMATION_DURATION }}
          out:send={{ key: _key, duration: BASE_ANIMATION_DURATION }}
        />
      {/if}
    </button>
  {:catch e}
    <p class="error">Error: {e?.message || e}</p>
    <img src={placeholderSrc} alt={_key} draggable="false" {style} />
  {/await}
  <img
    class="backdrop"
    src={placeholderSrc}
    alt={_key}
    draggable="false"
    aria-hidden="true"
    {style}
  />
</div>

<ImageModal bind:dialog bind:show={showImageModal}>
  <img
    src={fullSrc}
    alt={_key}
    {style}
    in:receive={{ key: _key, duration: BASE_ANIMATION_DURATION }}
    out:send={{ key: _key, duration: BASE_ANIMATION_DURATION }}
  />
</ImageModal>

<style lang="scss">
  @import '@styles/mixins';

  .placeholder,
  .backdrop {
    position: absolute;
    top: 0;
  }

  .placeholder {
    left: 0;
    opacity: 50%;
  }

  div:not(.loading) {
    @apply relative w-full;

    .backdrop {
      @apply -translate-x-1/2 transition-opacity;

      z-index: -1;
      filter: blur(20px);
      opacity: 0.2;
      left: 50%;
    }

    @include focused {
      .backdrop {
        opacity: 30%;
      }
    }
  }

  button {
    @apply relative mx-auto block max-h-fit w-full rounded-sm;

    @include focus-state(sm);
  }

  img {
    @apply mx-auto w-full select-none rounded-sm;
  }

  .error,
  .loading {
    @apply absolute left-1/2 top-1/2 h-fit w-fit max-w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-code text-base;
  }
</style>
