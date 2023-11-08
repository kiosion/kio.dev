<script lang="ts">
  import { writable } from 'svelte/store';
  import { crossfade, fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

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
</script>

<div class="carousel">
  <div class="scroller">
    {#if $values.length > 1}
      {#each $values as image, i}
        <button
          class="focusOutline-sm"
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
            <img src={$values[0].asset} draggable="false" alt="0" style="opacity: 0;" />
          {/await}
        {:else}
          <img
            src={$values[0].asset}
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
        src={$values[currentIndex].asset}
        draggable="false"
        alt={currentIndex.toString()}
        in:receive={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
        out:send={{ key: currentIndex, duration: BASE_ANIMATION_DURATION }}
      />
    </div>
  </dialog>
{/if}

{#if imageElements.length > 1}
  <div class="buttons">
    <ScrollButton dir="left" onClick={scrollLeft} />
    <ScrollButton dir="right" onClick={scrollRight} />
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
    @apply flex min-w-fit flex-row gap-4;
  }

  .buttons {
    @apply flex w-full flex-row items-center justify-between;
  }

  button {
    @apply relative;

    img {
      @apply h-full w-full flex-shrink-0;
    }
  }

  img {
    @apply select-none rounded-sm border border-dark/20;
  }

  dialog {
    @apply fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/80;

    div {
      @apply relative flex h-full max-h-full w-full max-w-full flex-col items-center justify-center p-8;
    }
  }

  :global(.dark) {
    img {
      @apply border-light/20;
    }
  }
</style>
