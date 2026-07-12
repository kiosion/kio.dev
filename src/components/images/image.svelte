<script lang="ts">
  import ImageModal from '$components/images/image-modal.svelte';
  import { zoomFrom } from '$lib/transitions';

  let {
    src,
    alt = '',
    caption,
    width,
    height,
    zoom = true,
    class: className = '',
  }: {
    src: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    zoom?: boolean;
    class?: string;
  } = $props();

  let showModal = $state(false);
  let inlineImg: HTMLImageElement | undefined = $state();

  const aspect = $derived(width && height ? `${width} / ${height}` : undefined);
</script>

<figure class="my-6 flex flex-col gap-2{className ? ' ' + className : ''}">
  {#if zoom}
    <button
      type="button"
      class="block cursor-zoom-in rounded-md transition-[scale] active:scale-[0.99]"
      class:invisible={showModal}
      aria-label={alt || 'Open image'}
      onclick={() => (showModal = true)}
    >
      <img
        bind:this={inlineImg}
        {src}
        {alt}
        {width}
        {height}
        loading="lazy"
        decoding="async"
        draggable="false"
        class="block h-auto max-w-3xl rounded-md select-none"
      />
    </button>
  {:else}
    <img
      {src}
      {alt}
      {width}
      {height}
      loading="lazy"
      decoding="async"
      class="block h-auto max-w-3xl rounded-md"
    />
  {/if}

  {#if caption}
    <figcaption class="text-sm text-neutral-400">{caption}</figcaption>
  {/if}
</figure>

{#if zoom}
  <ImageModal bind:show={showModal}>
    <img
      {src}
      {alt}
      class="h-full w-full rounded-md object-contain select-none"
      in:zoomFrom={{ from: inlineImg?.getBoundingClientRect() }}
      out:zoomFrom={{ from: inlineImg?.getBoundingClientRect() }}
    />
  </ImageModal>
{/if}
