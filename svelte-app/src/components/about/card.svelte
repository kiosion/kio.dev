<script lang="ts">
  import { fade } from 'svelte/transition';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import type { SanityImageObject } from '$types/sanity';
  import type { InputValue } from '@portabletext/svelte/ptTypes';
  import EmptyContent from '$components/empty-content.svelte';

  let pfpCrop: ImageCrop;

  export let image: SanityImageObject | undefined;
  export let body: InputValue | undefined;

  $: pfpCrop = getCrop(image);
</script>

<div
  class="flex flex-col items-start justify-start w-full gap-6 p-6 transition-colors bg-stone-300/60 dark:bg-stone-900/50 border border-stone-400/60 dark:border-stone-500/60 rounded-xl"
>
  <div
    class="flex flex-row items-center justify-start w-full gap-6 md:gap-7 p-3 md:p-4 pb-1 md:pb-2 h-fit"
  >
    <div class="h-20 md:h-24 aspect-square">
      {#if image?.asset}
        <img
          class="h-full outline outline-offset-2 outline-2 outline-stone-600 dark:outline-stone-300/90 rounded-full select-none aspect-square transition-[outline]"
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
    <div class="flex flex-col items-start justify-start flex-1 w-full h-full">
      <h3
        class="text-2xl font-bold transition-colors font-heading text-stone-800 dark:text-stone-100"
      >
        Maxim
      </h3>
      <h4
        class="font-mono text-xl font-bold transition-colors text-stone-600 dark:text-stone-300"
      >
        @kiosion
      </h4>
    </div>
  </div>
  <div class="flex-1 p-2 pt-0 -my-4 font-sans">
    {#if body}
      <PortableText text={body} />
    {:else}
      <EmptyContent />
    {/if}
  </div>
</div>
