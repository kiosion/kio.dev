<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type { PixelIcon } from '@/lib/types';

  const CardText = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/card-text.svg').then((Icon) => Icon.default);
  const ArticleMultiple = (): Promise<PixelIcon> =>
    import('pixelarticons/svg/article-multiple.svg').then(
      (Icon) => Icon.default
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let tags: any[] | undefined;
</script>

<div class="mt-4" data-test-id="post-footer">
  <Divider />
  {#if tags?.length}
    <IconHeader
      icon={CardText}
      text="Filed under"
      classes="mt-8 mb-4 w-full h-fit"
    />
    <div class="mb-6">
      <div class="flex flex-row flex-wrap gap-2 justify-start items-start">
        {#each tags as tag}
          <a
            href="/tag/{tag?.slug?.current ? tag.slug.current : '#'}"
            class="w-fit text-base bg-slate-200 dark:bg-slate-900 rounded-md"
            tabindex="0"
          >
            <div class="w-fit py-1 px-2 rounded-md" tabindex="0">
              {tag?.title ? tag.title : 'Undefined'}
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
  <!-- TODO: Lazy-load 4 or so recent articles or articles with similar tags (search API?) -->
  {#if false}
    <IconHeader
      icon={ArticleMultiple}
      text="More posts"
      classes="mt-8 mb-4 w-full h-fit"
    />
  {/if}
</div>
