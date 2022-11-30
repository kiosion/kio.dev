<script lang="ts">
  import { fionaPlaceholder } from '$helpers/placeholders';
  import type { ProjectDocument } from '$types';

  export let data: ProjectDocument;

  $: slug = data.slug.current;
  $: image = fionaPlaceholder(slug);
</script>

<div class="relative md:mt-2 -mb-20 z-[0] w-[110%] -translate-x-[5%]">
  <div
    class="absolute w-full h-full gradient from-slate-100 dark:from-slate-800 transition-colors"
  >
    &nbsp;
  </div>
  <img
    src={image}
    width="1000"
    height="400"
    alt="Project preview"
    class="w-full aspect-[1000/400] rounded-t-2xl select-none"
    draggable="false"
  />
</div>
<div class="relative z-[1]">
  <slot name="title" />
  <slot name="tags" />
  <slot name="meta" />
  <slot name="desc" />
</div>

<style lang="scss">
  .gradient {
    background: linear-gradient(
      to top,
      var(--tw-gradient-from) 5%,
      var(--tw-gradient-to) 100%
    );
  }
</style>
