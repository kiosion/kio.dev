<script lang="ts">
  import { urlFor, getCrop } from '$lib/helpers/image';
  import type { ProjectDocument } from '$lib/types';

  export let data: ProjectDocument;

  $: headerRef = data.image?.asset?._ref;
  $: headerCrop = headerRef && getCrop(data.image);
</script>

{#if headerRef && headerCrop}
  <div class="mb-8 md:mt-2">
    <img
      src={urlFor(headerRef)
        .width(1000)
        .height(400)
        .rect(
          headerCrop.left,
          headerCrop.top,
          headerCrop.width,
          headerCrop.height
        )
        .fit('crop')
        .format('webp')
        .url()}
      alt="Project preview"
      class="w-full shadow-[0_0_28px_-2px_var(--tw-shadow)] shadow-slate-500/50 dark:shadow-slate-500/20 rounded-tl-2xl rounded-tr-sm rounded-bl-sm rounded-br-2xl aspect-[1000/400] select-none"
      draggable="false"
    />
  </div>
{/if}
<slot name="title" />
<slot name="tags" />
<slot name="desc" />
<slot name="meta" />
