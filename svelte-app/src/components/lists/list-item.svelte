<script lang="ts">
  import { currentLang, linkTo, t } from '$i18n';
  import { formatDate } from '$lib/helpers/date';
  import { parseViews } from '$lib/views';

  import Hoverable from '$components/hoverable.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let document: PostDocument | ProjectDocument,
    small = false;

  let hovered = false;

  const link =
    document._type === 'post'
      ? `/blog/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<Hoverable bind:hovered>
  <a
    href={$linkTo(link)}
    class="focusOutline w-full rounded-md"
    tabindex="0"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    <div
      class="mt-0.5 flex flex-row items-center justify-start gap-3 font-mono text-sm text-dark/80 transition-colors dark:text-light/80 {small
        ? 'mb-1.5'
        : 'mb-2'}"
    >
      <p aria-label={$t('Date posted')}>
        {formatDate(
          document.date || document._createdAt,
          small ? 'med' : 'short',
          $currentLang
        )}
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
      class="min-w-fit font-display font-medium decoration-accent-light decoration-[3px] underline-offset-4 transition-colors dark:decoration-accent-dark {small
        ? 'text-lg decoration-2 underline-offset-2'
        : 'text-xl decoration-[3px] underline-offset-4'}"
      class:underline={hovered}
    >
      {document.title}
    </h1>
    {#if document.desc?.length && !small}
      <p class="mt-2 line-clamp-1 text-base">{document.desc}</p>
    {/if}
  </a>
</Hoverable>
