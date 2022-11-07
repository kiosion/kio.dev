<script lang="ts">
  import Divider from '$components/context-menu/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type { PostDocument, ProjectDocument } from '$lib/types';
  import Features from '$stores/features';
  import type UIfx from 'uifx';
  import { linkTo } from '$i18n';
  import { onMount } from 'svelte';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx')
      .then((sfx) => {
        click = sfx.click;
      })
      .catch(() => undefined);
  });

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<div class="mt-4" data-test-id="{model}-footer">
  <Divider />
  {#if data.tags}
    <IconHeader icon="CardText" text="Tags" classes="mt-8 mb-4 w-full h-fit" />
    <div class="mb-6 flex flex-row flex-wrap gap-2 justify-start items-start">
      {#each data.tags as tag}
        <Hoverable>
          <a
            href={linkTo(
              `/${model === 'post' ? 'blog' : 'work'}/+/${tag.slug.current}`
            )}
            class="categoryTag"
            on:click={() => CanUseSounds && click.play()}
            on:keydown={(e) =>
              e.code === 'Enter' ||
              (e.code === 'Space' && CanUseSounds && click.play())}
          >
            {tag.title}
          </a>
        </Hoverable>
      {/each}
    </div>
  {/if}
</div>
