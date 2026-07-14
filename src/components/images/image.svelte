<script lang="ts">
  let {
    src,
    alt = '',
    caption,
    width,
    height,
    class: className = '',
  }: {
    src: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    class?: string;
  } = $props();

  /**
   * Fade lazy-loaded images in instead of letting them pop mid-read. Actions
   * only run client-side, so no-JS renders at full opacity, and images already
   * in cache (complete before hydration) skip the fade entirely.
   */
  const fadeOnLoad = (img: HTMLImageElement) => {
    if (img.complete) {
      return;
    }
    img.style.opacity = '0';
    img.addEventListener(
      'load',
      () => {
        img.style.transition = 'opacity 250ms var(--ease-out)';
        img.style.opacity = '1';
      },
      { once: true },
    );
  };
</script>

<figure class="my-6 flex flex-col gap-2{className ? ' ' + className : ''}">
  <img
    {src}
    {alt}
    {width}
    {height}
    loading="lazy"
    decoding="async"
    class="block h-auto max-w-3xl rounded-md"
    use:fadeOnLoad
  />

  {#if caption}
    <figcaption class="text-sm text-neutral-400">{caption}</figcaption>
  {/if}
</figure>
