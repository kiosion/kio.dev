<script lang="ts">
  import { fionaPlaceholder } from '$helpers/placeholders';
  import type { ProjectDocument } from '$types';

  export let data: ProjectDocument;

  $: slug = data.slug.current;
  $: image = fionaPlaceholder(slug);
</script>

<div class="mb-8 md:mt-2">
  <img
    src={image}
    width="1000"
    height="400"
    alt="Project preview"
    class="w-full shadow-[0_0_28px_-2px_var(--tw-shadow)] shadow-slate-500/50 dark:shadow-slate-500/20 rounded-tl-2xl rounded-tr-sm rounded-bl-sm rounded-br-2xl aspect-[1000/400] select-none"
    draggable="false"
  />
</div>
<slot name="title" />
<slot name="tags" />
<slot name="desc" />
<slot name="meta" />
