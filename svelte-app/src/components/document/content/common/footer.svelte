<script lang="ts">
  import Divider from '$components/context-menu/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import type { PostDocument, ProjectDocument } from '$lib/types';
  import { linkTo } from '$i18n';
  import SFX from '$lib/sfx';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;
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
            on:click={() => SFX.click.play()}
            on:keydown={(e) =>
              e.code === 'Enter' || (e.code === 'Space' && SFX.click.play())}
          >
            {tag.title}
          </a>
        </Hoverable>
      {/each}
    </div>
  {/if}
</div>
