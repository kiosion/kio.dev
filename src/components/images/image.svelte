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
  />

  {#if caption}
    <figcaption class="text-sm text-neutral-400">{caption}</figcaption>
  {/if}
</figure>
