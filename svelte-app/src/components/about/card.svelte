<script lang="ts">
  import { fade } from 'svelte/transition';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import ErrorText from '$components/error-text.svelte';
  import { urlFor, getCrop, type ImageCrop } from '$lib/helpers/image';
  import type { SanityImageObject } from '$lib/types';
  import type { InputValue } from '@portabletext/svelte/ptTypes';

  let pfpCrop: ImageCrop;

  export let image: SanityImageObject | undefined;
  export let body: InputValue | undefined;

  $: pfpCrop = getCrop(image);
</script>

<div
  class="w-full p-6 roundedCard-lg flex flex-col gap-6 justify-start items-start"
>
  <div class="flex flex-row gap-6 justify-start items-center w-full h-fit p-1">
    <div class="h-16 md:h-24 aspect-square">
      {#if image?.asset}
        <img
          class="rounded-full aspect-square h-full border border-slate-400 select-none"
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
    <div class="flex-1 h-full w-full flex flex-col justify-start items-start">
      <h3
        class="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 transition-colors"
      >
        Maxim
      </h3>
      <h4
        class="font-mono font-bold text-xl text-slate-600 dark:text-slate-300 transition-colors"
      >
        @kiosion
      </h4>
    </div>
  </div>
  <div class="flex-1 font-sans -my-4 p-2">
    {#if body}
      <PortableText text={body} />
    {:else}
      <ErrorText text="No data" classes="w-fit" />
    {/if}
  </div>
</div>
