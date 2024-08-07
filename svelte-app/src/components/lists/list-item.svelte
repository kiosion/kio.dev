<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';
  import { parseViews } from '$lib/utils';

  import Hoverable from '$components/hoverable.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let document: PostDocument | ProjectDocument,
    lone = false;

  const link =
    document._type === 'post'
      ? `/thoughts/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<Hoverable let:hovered>
  <a
    href={$linkTo(link)}
    class="focus-outline relative w-full min-w-[18rem] rounded-xl p-2 transition-colors xl:max-w-[calc(50%_-_.625rem)] {lone
      ? 'bg-neutral-0/75 hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800'
      : 'border border-neutral-200/50 bg-neutral-100 hover:bg-neutral-100/50 focus-visible:bg-neutral-100/50 dark:border-neutral-500/50 dark:bg-neutral-600 dark:hover:bg-neutral-600/50 dark:focus-visible:bg-neutral-600/50'}"
    tabindex="0"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    <div
      class="flex flex-row flex-wrap items-center justify-start gap-2 p-1.5 font-mono text-sm leading-[1.2] text-neutral-700 transition-colors dark:text-neutral-200"
    >
      <span
        class="flex flex-row items-center justify-start gap-1.5 rounded-md px-2 py-1.5 font-sans text-sm transition-colors {lone
          ? 'bg-neutral-100/75 dark:bg-neutral-500/50'
          : 'bg-neutral-0/75 dark:bg-neutral-500'}"
        class:bg-neutral-0={hovered && !lone}
        class:dark:bg-neutral-400={hovered && !lone}
      >
        <span class="select-none font-bold">#</span>
        <span
          >{document.tags?.[0]?.title?.toLowerCase() ||
            $t('Uncategorized').toLowerCase()}</span
        >
      </span>
      <span class="flex flex-row flex-wrap items-center justify-start gap-2 text-xs">
        <p class="whitespace-nowrap px-1.5 py-1" aria-label={$t('Date posted')}>
          {$formatDate(document.date || document._createdAt, 'med')}
        </p>
        <span class="select-none">/</span>
        <p class="whitespace-nowrap px-1.5 py-1">
          {$t('{views} views', { views: $parseViews(document.views ?? 0) })}
        </p>
      </span>
    </div>

    <h1
      class="line-clamp-2 px-2 font-sans text-2xl font-bold leading-9 decoration-orange-light decoration-[3px] underline-offset-4 transition-colors lg:max-w-[60rem]"
      class:pb-1={document.desc?.length}
      class:underline={hovered}
    >
      {document.title}
    </h1>

    {#if document.desc?.length}
      <p
        class="line-clamp-3 px-2 pb-1.5 text-base text-neutral-700 transition-colors dark:text-neutral-200 lg:max-w-[60rem]"
      >
        {document.desc}
      </p>
    {/if}
  </a>
</Hoverable>
