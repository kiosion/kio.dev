<script lang="ts">
  import { fade } from 'svelte/transition';

  import { getCrop, type ImageCrop, urlFor } from '$lib/helpers/image';

  import EmptyContent from '$components/empty-content.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type {
    ArbitraryTypedObject,
    PortableTextBlock,
    SanityImageObject
  } from '$types/sanity';

  let pfpCrop: ImageCrop;

  export let name: string | undefined,
    username: string | undefined,
    image: SanityImageObject | undefined,
    body: (PortableTextBlock | ArbitraryTypedObject)[] | undefined;

  $: pfpCrop = getCrop(image);
</script>

<div
  class="flex w-full flex-col items-start justify-start gap-6 rounded-xl border border-stone-400/60 bg-stone-300/60 p-6 dark:border-stone-500/60 dark:bg-stone-900/50"
>
  <div
    class="flex h-fit w-full flex-row items-center justify-start gap-6 p-3 pb-1 md:gap-7 md:p-4 md:pb-2"
  >
    <div class="aspect-square h-20 md:h-24">
      {#if image?.asset}
        <img
          class="aspect-square h-full select-none rounded-full outline outline-2 outline-offset-2 outline-stone-600 transition-[outline] dark:outline-stone-300/90"
          src={urlFor(image.asset._ref)
            .size(150, 150)
            .rect(pfpCrop.left, pfpCrop.top, pfpCrop.width, pfpCrop.height)
            .fit('crop')
            .format('webp')
            .url()}
          alt="Profile pic"
          draggable="false"
          in:fade={{ duration: 150 }}
        />
      {/if}
    </div>
    <div class="flex h-full w-full flex-1 flex-col items-start justify-start">
      <h3 class="font-sans text-2xl font-bold text-stone-800 dark:text-stone-100">
        {name}
      </h3>
      <h4 class="font-mono text-xl font-bold text-stone-600 dark:text-stone-300">
        @{username}
      </h4>
    </div>
  </div>
  <div class="-my-4 flex-1 p-2 pt-0 font-sans">
    {#if body}
      <PortableText text={body} />
    {:else}
      <EmptyContent />
    {/if}
  </div>
</div>
