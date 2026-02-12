<script lang="ts">
  import type { SanityImageObject } from '@sanity/image-url/lib/types/types';
  import ImageModal from '$components/images/image-modal.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { buildImageUrl, getCrop } from '$lib/sanity';
  import { crossfade, fade } from 'svelte/transition';

  let {
    image,
    placeholder = undefined,
    crop = getCrop(image),
  }: {
    image: SanityImageObject & { _key: string };
    placeholder?: string;
    crop?: SanityImageObject['crop'] & { width: number; height: number };
  } = $props();

  let loaded = $state(false),
    dialog = $state<HTMLDialogElement>(),
    showImageModal = $state(false),
    imgDimensions = $derived({
      width: Math.min(crop.width, 1200),
      height: Math.min(crop.width, 1200) * (crop.height / crop.width),
    }),
    placeholderSrc = $derived(
      placeholder || buildImageUrl({ ref: image.asset._ref, crop, width: 30, blur: 40 }),
    ),
    fullSrc = $derived(
      buildImageUrl({ ref: image.asset._ref, crop, width: imgDimensions.width }),
    );

  const [send, receive] = crossfade({
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
        `,
      };
    },
  });
</script>

<div class="relative h-full">
  {#if !loaded}
    <div
      class="loading font-code absolute top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform text-center text-base"
      style="max-width: {imgDimensions.width}px; left: min(50%, {imgDimensions.width /
        2}px);">
      <Spinner></Spinner>
    </div>
    <!-- svelte-ignore a11y_missing_attribute -->
    <img
      class="w-full rounded-md select-none"
      src={placeholderSrc}
      draggable="false"
      style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};" />
  {:else}
    <button
      class="focus-outline-sm relative block max-h-fit w-full cursor-zoom-in rounded-md"
      style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
      onclick={() => {
        showImageModal = !showImageModal;
      }}
      onkeyup={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
          showImageModal = !showImageModal;
        }
      }}
      type="button">
      {#if showImageModal}
        <img
          class="placeholder absolute top-0 left-0 w-full rounded-md opacity-50 select-none"
          src={placeholderSrc}
          alt={image._key}
          draggable="false"
          style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
          out:fade={{ duration: BASE_ANIMATION_DURATION }} />
      {:else}
        <img
          src={fullSrc}
          class="w-full rounded-md select-none"
          alt={image._key}
          draggable="false"
          in:receive={{ key: image._key, duration: BASE_ANIMATION_DURATION }}
          out:send={{ key: image._key, duration: BASE_ANIMATION_DURATION }} />
      {/if}
    </button>
  {/if}
  <!-- Preload: triggers native fetch, fires on:load when ready -->
  <img
    src={fullSrc}
    alt=""
    loading="lazy"
    class="!absolute !h-0 !w-0 !overflow-hidden"
    onload={() => (loaded = true)} />
  <img
    class="backdrop absolute top-0 left-1/2 -z-[1] w-full -translate-x-1/2 rounded-md opacity-20 blur-lg transition-opacity select-none print:hidden"
    src={placeholderSrc}
    alt={image._key}
    draggable="false"
    aria-hidden="true"
    style="max-width: {imgDimensions.width}px; max-height: {imgDimensions.height}px; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};" />
</div>

<ImageModal bind:dialog bind:show={showImageModal}>
  <img
    class="mx-auto box-border max-h-full max-w-full rounded-md select-none"
    src={fullSrc}
    alt={image._key}
    style="object-fit: contain; aspect-ratio: {imgDimensions.width} / {imgDimensions.height};"
    in:receive={{ key: image._key, duration: BASE_ANIMATION_DURATION }}
    out:send={{ key: image._key, duration: BASE_ANIMATION_DURATION }} />
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
