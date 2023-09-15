<script lang="ts">
  import { maybe } from 'svelte-maybe-transition';

  import { linkTo } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';

  import type { DocumentTags } from '$types';

  export let size: 'sm' | 'lg' = 'sm',
    model: 'post' | 'project',
    animate = false,
    enable = animate,
    classes = '',
    data: DocumentTags[];

  const tagLink = (slug: string) =>
    $linkTo(`/${model === 'post' ? 'blog' : 'work'}/+/${slug}`);

  $: tagClass = size === 'sm' ? 'categoryTag-sm' : 'categoryTag';
</script>

<div
  class="flex flex-row flex-wrap items-center justify-start gap-2 {classes}"
  aria-label="Tags"
  role="group"
  in:maybe={{ enable, fn: 'slide', duration: 150 }}
  out:maybe={{ enable, fn: 'slide', duration: 150 }}
>
  {#each data as tag}
    <Hoverable>
      <a href={tagLink(tag.slug.current)} class="{tagClass} focusOutline-sm"
        >{tag.title}</a
      >
    </Hoverable>
  {/each}
</div>
