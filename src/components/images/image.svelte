<script lang="ts">
  import ImageModal from '$components/images/image-modal.svelte';

  let {
    src,
    alt = '',
    caption,
    width,
    height,
    zoom = false,
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

  const aspect = $derived(width && height ? `${width} / ${height}` : undefined);
</script>

<figure class="my-6 flex flex-col gap-2{className ? ' ' + className : ''}">
  {#if zoom}
    <button
      type="button"
      class="focus-outline-sm block w-full cursor-zoom-in rounded-md"
      aria-label={alt || 'Open image'}
      onclick={() => (showModal = true)}>
      <img
        {src}
        {alt}
        {width}
        {height}
        loading="lazy"
        decoding="async"
        draggable="false"
        class="block w-full rounded-md select-none"
        style:aspect-ratio={aspect} />
    </button>
  {:else}
    <img
      {src}
      {alt}
      {width}
      {height}
      loading="lazy"
      decoding="async"
      class="block w-full rounded-md"
      style:aspect-ratio={aspect} />
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
      class="mx-auto max-h-full max-w-full rounded-md object-contain select-none" />
  </ImageModal>
{/if}
