<script lang="ts">
  import { buildImageUrl, getCrop } from '$lib/sanity';
  import settings from '$lib/settings';
  import type { SiteConfig } from '$types';

  const { theme } = settings;

  export let images: SiteConfig['image'];

  $: imageToUse = images[$theme] || images.dark;
  $: crop = getCrop(imageToUse);
  $: imageUrl = buildImageUrl({
    ref: imageToUse.asset._ref,
    crop,
    width: 100,
    format: 'webp'
  });
</script>

<img
  class="aspect-square h-14 w-14 flex-shrink-0 rounded-lg bg-neutral-300/50 p-0 select-none dark:bg-neutral-100/50"
  src={imageUrl}
  alt="kio.dev"
/>
