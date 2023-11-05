<script lang="ts">
  import { crossfade, fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { getCrop, urlFor } from '$lib/helpers/image';

  import ScrollButton from '$components/portable-text/image-carousel/scroll-button.svelte';

  import type { SanityImageObject } from '$types';

  export let images: SanityImageObject[];

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

  $: values = images.map((image) => {
    const crop = getCrop(image),
      baseUrl = urlFor(image.asset._ref),
      carouselDimensions = {
        width: carouselMaxHeight * (crop.width / crop.height),
        height: carouselMaxHeight
      };

    return {
      crop,
      carouselDimensions,
      srcUrl: baseUrl
        .height(600)
        .rect(crop.left, crop.top, crop.width, crop.height)
        .fit('crop')
        .auto('format')
        .url()
    };
  });
</script>

<div class="relative w-full overflow-y-hidden overflow-x-scroll">
  <div class="flex min-w-fit flex-row gap-4">
    {#if values.length > 1}
      {#each values as image, i}
        <button
          class="focusOutline-sm"
          style="
            aspect-ratio: {image.crop.width} / {image.crop.height};
            width: {image.carouselDimensions.width}px;
            height: {image.carouselDimensions.height}px;
            max-height: {carouselMaxHeight}px;
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
        >
          {#if showImageModal && currentIndex === i}
            <img
              src={image.srcUrl}
              draggable="false"
              alt={i.toString()}
              class="opacity-0"
            />
          {:else}
            <img
              src={image.srcUrl}
              draggable="false"
              alt={i.toString()}
              bind:this={imageElements[i]}
              in:receive={{ key: i, duration: BASE_ANIMATION_DURATION }}
              out:send={{ key: i, duration: BASE_ANIMATION_DURATION }}
            />
          {/if}
        </button>
      {/each}
    {:else}
      <button
        class="focusOutline-sm"
        style="width: 100%;"
        on:click={() => {
          showImageModal = true;
        }}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            showImageModal = true;
          }
        }}
      >
        {#if showImageModal}
          <!--
            Wow this is jank and sucks and needs to be rewritten properly,
            this is just a style issue since the max-height isn't constrained
          -->
          {#await new Promise((r) => setTimeout(r, BASE_ANIMATION_DURATION)) then _}
            <img src={values[0].srcUrl} draggable="false" alt="0" class="opacity-0" />
          {/await}
        {:else}
          <img
            src={values[0].srcUrl}
            draggable="false"
            alt="0"
            bind:this={imageElements[0]}
            in:receive={{ key: 0, duration: BASE_ANIMATION_DURATION }}
            out:send={{ key: 0, duration: BASE_ANIMATION_DURATION }}
          />
        {/if}
      </button>
    {/if}
  </div>
</div>

<svelte:window
  on:keydown={(e) => {
    if (showImageModal) {
      switch (e.key) {
        case 'ArrowLeft':
          scrollLeft();
          break;
        case 'ArrowRight':
          scrollRight();
          break;
        case 'Escape':
        case 'Enter':
          showImageModal = false;
          break;
        case 'Tab':
          e.preventDefault();
          dialog.focus();
          break;
      }
    }
  }}
/>

{#if showImageModal}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog
    bind:this={dialog}
    on:click={() => (showImageModal = false)}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        showImageModal = false;
      }
    }}
    in:fade={{ duration: BASE_ANIMATION_DURATION }}
    out:fade={{ duration: BASE_ANIMATION_DURATION }}
  >
    <div>
      <img
        src={values[currentIndex].srcUrl}
        draggable="false"
        alt="image-{currentIndex}"
        in:receive={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
        out:send={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
      />
    </div>
  </dialog>
{/if}

<div class="flex w-full flex-row items-center justify-between">
  <ScrollButton dir="left" onClick={scrollLeft} disabled={imageElements.length === 1} />
  <ScrollButton dir="right" onClick={scrollRight} disabled={imageElements.length === 1} />
</div>

<style lang="scss">
  button {
    @apply relative;

    img {
      @apply min-w-full max-w-full flex-shrink-0;
    }
  }

  img {
    @apply select-none rounded-sm border border-dark/40;
  }

  dialog {
    @apply fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/80;

    div {
      @apply relative flex h-full max-h-full w-full max-w-full flex-col items-center justify-center p-8;
    }
  }

  :global(.dark) {
    img {
      @apply border-light/40;
    }
  }
</style>
