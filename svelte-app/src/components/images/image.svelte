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

<div class="relative w-full">
  {#await srcPromise || new Promise((_res) => {})}
    <div
      class="loading absolute left-1/2 top-1/2 h-fit w-fit max-w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-code text-base"
    >
      <Spinner />
    </div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
      class="mx-auto w-full select-none rounded-sm"
      draggable="false"
      src={placeholderSrc}
    />
  {:then src}
    <button
      style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
      class="focus-outline-sm relative mx-auto block max-h-fit w-full rounded-sm"
      type="button"
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
          style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
          class="placeholder absolute left-0 top-0 mx-auto w-full select-none rounded-sm opacity-50"
          alt={_key}
          draggable="false"
          src={placeholderSrc}
          out:fade={{ duration: BASE_ANIMATION_DURATION }}
        />
      {:else}
        <img
          class="mx-auto w-full select-none rounded-sm"
          alt={_key}
          draggable="false"
          {src}
          in:receive={{ key: _key, duration: BASE_ANIMATION_DURATION }}
          out:send={{ key: _key, duration: BASE_ANIMATION_DURATION }}
        />
      {/if}
    </button>
  {:catch e}
    <p
      class="error absolute left-1/2 top-1/2 h-fit w-fit max-w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-code text-base"
    >
      Error: {e?.message || e}
    </p>
    <img
      style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
      alt={_key}
      draggable="false"
      src={placeholderSrc}
    />
  {/await}
  <img
    style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
    class="backdrop absolute left-1/2 top-0 -z-[1] mx-auto w-full -translate-x-1/2 select-none rounded-sm opacity-20 blur-lg transition-opacity"
    alt={_key}
    aria-hidden="true"
    draggable="false"
    src={placeholderSrc}
  />
</div>

<ImageModal bind:dialog bind:show={showImageModal}>
  <img
    style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
    class="mx-auto w-full select-none rounded-sm"
    alt={_key}
    src={fullSrc}
    in:receive={{ key: _key, duration: BASE_ANIMATION_DURATION }}
    out:send={{ key: _key, duration: BASE_ANIMATION_DURATION }}
  />
</ImageModal>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @include focused {
      .backdrop {
        @apply opacity-30;
      }
    }
  }
</style>
