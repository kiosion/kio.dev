<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { parseViews } from '$lib/utils';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let document: PostDocument | ProjectDocument;

  const link =
    document._type === 'post'
      ? `/thoughts/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<Hoverable let:hovered>
  <a
    href={$linkTo(link)}
    class="focus-outline w-full rounded-md"
    tabindex="0"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    <div
      class="flex flex-row items-center justify-start pb-1 pt-0.5 font-mono text-sm leading-[1.2] text-dark/80 transition-colors dark:text-light/80"
      class:gap-3={document.tags?.length}
    >
      <p class="line-clamp-1" aria-label={$t('Date posted')}>
        {$formatDate(document.date || document._createdAt, 'med')}
      </p>
      {#if document.tags?.length}
        <span
          class="font-code rounded-sm border border-dark/80 bg-dark/5 px-1.5 py-1 text-xs transition-colors dark:border-light/60 dark:bg-light/5"
          >{document.tags[0].title.toLowerCase()}</span
        >
      {:else}
        <BulletPoint></BulletPoint>
      {/if}
      <p>{$t('{views} views', { views: $parseViews(document.views ?? 0) })}</p>
    </div>

    <h1
      class="line-clamp-2 font-sans text-2xl font-bold leading-9 decoration-accent-light decoration-[3px] underline-offset-4 transition-colors dark:decoration-accent-dark lg:max-w-[60rem]"
      class:pb-1={document.desc?.length}
      class:underline={hovered}
    >
      {document.title}
    </h1>

    {#if document.desc?.length}
      <p class="line-clamp-2 lg:max-w-[60rem]">{document.desc}</p>
    {/if}
  </a>
</Hoverable>
