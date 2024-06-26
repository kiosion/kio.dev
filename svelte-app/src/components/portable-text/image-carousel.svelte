<script lang="ts">
  import { writable } from 'svelte/store';
  import { crossfade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  import ImageModal from '$components/images/image-modal.svelte';
  import ScrollButton from '$components/portable-text/image-carousel/scroll-button.svelte';

  import type { ProjectImage } from '$types';

  export let images: ProjectImage[];

  let imageElements: HTMLImageElement[] = [],
    showImageModal = false,
    dialog: HTMLDialogElement,
    currentIndex = 0;

  const imageBorderWidth = 1,
    maxImageHeight = 400,
    carouselMaxHeight = maxImageHeight + imageBorderWidth * 2,
    scrollIntoView = () =>
      imageElements[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      }),
    scrollLeft = () => (currentIndex > 0 && --currentIndex, scrollIntoView()),
    scrollRight = () => (
      currentIndex < imageElements.length - 1 && ++currentIndex, scrollIntoView()
    ),
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

  const values = writable(
    images.map((image, i) => {
      image.asset.then((res) =>
        values.update((val) => {
          res && (val[i].asset = res);
          return val;
        })
      );

      return {
        crop: image.crop,
        asset: image.placeholder,
        carouselDimensions: {
          width: carouselMaxHeight * (image.crop.width / image.crop.height),
          height: carouselMaxHeight
        }
      };
    })
  );

  $: ({ asset } = $values[currentIndex]);
</script>

<div class="carousel">
  <div class="scroller">
    {#each $values as image, i}
      <button
        class="focus-outline-sm"
        style="
          aspect-ratio: {image.crop.width} / {image.crop.height};
          width: {image.carouselDimensions.width}px;
          height: {image.carouselDimensions.height}px;
        "
        on:click={() => {
          currentIndex = i;
          showImageModal = true;
        }}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            currentIndex = i;
            showImageModal = true;
          }
        }}
        type="button"
      >
        {#if showImageModal && currentIndex === i}
          <img
            src={image.asset}
            draggable="false"
            alt={i.toString()}
            style="opacity: 0;"
          />
        {:else}
          <img
            src={image.asset}
            draggable="false"
            alt={i.toString()}
            bind:this={imageElements[i]}
            in:receive={{ key: i, duration: BASE_ANIMATION_DURATION }}
            out:send={{ key: i, duration: BASE_ANIMATION_DURATION }}
          />
        {/if}
      </button>
    {/each}
  </div>
</div>

<ImageModal bind:dialog bind:show={showImageModal}>
  <img
    src={asset}
    draggable="false"
    alt={currentIndex.toString()}
    in:receive={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
    out:send={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
  />
</ImageModal>

{#if imageElements.length > 1}
  <div class="buttons">
    <ScrollButton dir="left" onClick={scrollLeft}></ScrollButton>
    <ScrollButton dir="right" onClick={scrollRight}></ScrollButton>
  </div>
{/if}

<style lang="scss">
  .carousel {
    @apply w-full overflow-y-hidden overflow-x-scroll;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }
  }

  .scroller {
    @apply flex w-full min-w-fit flex-row gap-4;
  }

  .buttons {
    @apply flex w-full flex-row items-center justify-between;
  }

  button {
    @apply relative block max-h-fit w-full rounded-sm;

    img {
      @apply h-full w-full flex-shrink-0;
    }
  }

  img {
    @apply select-none rounded-sm border border-dark/20;
  }

  :global(.dark) {
    img {
      @apply border-light/20;
    }
  }
</style>
