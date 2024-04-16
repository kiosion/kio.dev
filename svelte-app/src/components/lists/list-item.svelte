<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { parseViews } from '$lib/utils';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let document: PostDocument | ProjectDocument,
    small = false;

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
      class="flex flex-row items-center justify-start pb-1.5 pt-0.5 font-mono text-sm leading-[1.2] text-dark/80 transition-colors dark:text-light/80"
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
        <BulletPoint />
      {/if}
      <p>{$t('{views} views', { views: $parseViews(document.views ?? 0) })}</p>
    </div>

    <h1
      class="min-w-fit font-sans font-bold decoration-accent-light transition-colors dark:decoration-accent-dark"
      class:pb-2={!small && document.desc?.length}
      class:underline={hovered}
      class:text-xl={small}
      class:text-2xl={!small}
      class:decoration-2={small}
      class:decoration-[3px]={!small}
      class:underline-offset-2={small}
      class:underline-offset-4={!small}
    >
      {document.title}
    </h1>

    {#if !small && document.desc?.length}
      <p class="line-clamp-1 text-base leading-6">{document.desc}</p>
    {/if}
  </a>
</Hoverable>
