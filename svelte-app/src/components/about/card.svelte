<script lang="ts">
  import { fade } from 'svelte/transition';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import ErrorText from '$components/error-text.svelte';
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import type { SanityImageObject } from '$types/sanity';
  import type { InputValue } from '@portabletext/svelte/ptTypes';

  let pfpCrop: ImageCrop;

  export let image: SanityImageObject | undefined;
  export let body: InputValue | undefined;

  $: pfpCrop = getCrop(image);
</script>

<div
  class="flex flex-col items-start justify-start w-full gap-6 p-6 transition-colors bg-gray-200/50 dark:bg-gray-900/50 rounded-xl"
>
  <div class="flex flex-row items-center justify-start w-full gap-6 p-1 h-fit">
    <div class="h-16 md:h-24 aspect-square">
      {#if image?.asset}
        <img
          class="h-full border rounded-full select-none aspect-square border-gray-400"
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
        class="text-2xl font-bold transition-colors font-display text-gray-800 dark:text-gray-100"
      >
        Maxim
      </h3>
      <h4
        class="font-mono text-xl font-bold transition-colors text-gray-600 dark:text-gray-300"
      >
        @kiosion
      </h4>
    </div>
  </div>
  <div class="flex-1 p-2 -my-4 font-sans">
    {#if body}
      <PortableText text={body} />
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
  </div>
</div>
