<script lang="ts">
  import { formatDate } from '$lib/date';
  import { linkTo, t } from '$lib/i18n';

  import BulletPoint from '$components/bullet-point.svelte';

  import type { GetPostQueryResult, GetProjectQueryResult } from '$types/sanity';

  export let document: NonNullable<GetPostQueryResult | GetProjectQueryResult>;

  const link =
    document._type === 'post'
      ? `/thoughts/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<a
  href={$linkTo(link)}
  class="focus-outline group relative -my-3 flex w-full flex-col gap-y-1 rounded-lg p-3 transition-colors hover:bg-neutral-200/50 focus-visible:bg-neutral-200/50 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
  tabindex="0"
  data-sveltekit-preload-code
>
  <div
    class="flex flex-row flex-wrap items-center justify-start gap-0.5 px-0.5 font-sans text-sm font-medium text-neutral-700 transition-colors dark:text-neutral-200"
  >
    <span class="whitespace-nowrap">
      {$formatDate(document.date || document._createdAt, 'med')}
    </span>
    <BulletPoint />
    <span class="flex flex-row items-center justify-start gap-x-1">
      <span>
        {document.tags?.[0]?.title || $t('Uncategorized')}
      </span>
    </span>
  </div>
  <h1
    class="line-clamp-2 font-sans text-xl font-bold leading-9 decoration-orange-light decoration-[3px] underline-offset-4 transition-colors group-hover:underline group-focus-visible:underline lg:max-w-[60rem]"
  >
    {document.title}
  </h1>

  {#if document.desc?.length}
    <p
      class="line-clamp-3 text-base text-neutral-700 transition-colors dark:text-neutral-200 lg:max-w-[60rem]"
    >
      {document.desc}
    </p>
  {/if}
</a>
