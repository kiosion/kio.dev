<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { parseViews } from '$lib/utils';

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
    class:small
    class="focus-outline w-full rounded-md"
    tabindex="0"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    <div
      class="flex flex-row items-center justify-start gap-3 pb-2 pt-0.5 font-mono text-sm text-dark/80 transition-colors dark:text-light/80"
      class:pb-1.5={small}
    >
      <p class="line-clamp-1" aria-label={$t('Date posted')}>
        {$formatDate(document.date || document._createdAt, 'med')}
      </p>
      {#if document.tags?.length}
        <span
          class="rounded-sm bg-dark/10 px-1.5 py-0.5 font-code text-sm transition-colors dark:bg-light/10"
          >{document.tags[0].title.toLowerCase()}</span
        >
      {/if}
      <p>{$t('{views} views', { views: $parseViews((document.views ?? 0) + 1) })}</p>
    </div>

    <h1
      class="min-w-fit font-bold decoration-accent-light transition-colors dark:decoration-accent-dark"
      class:pb-1={!small && document.desc?.length}
      class:underline={hovered}
      class:text-lg={small}
      class:text-xl={!small}
      class:decoration-2={small}
      class:decoration-[3px]={!small}
      class:underline-offset-2={small}
      class:underline-offset-4={!small}
    >
      {document.title}
    </h1>

    {#if !small && document.desc?.length}
      <p class="line-clamp-1">{document.desc}</p>
    {/if}
  </a>
</Hoverable>
