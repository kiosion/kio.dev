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
      ? `/blog/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<Hoverable let:hovered>
  <a
    href={$linkTo(link)}
    class:small
    tabindex="0"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    <div>
      <p aria-label={$t('Date posted')}>
        {$formatDate(document.date || document._createdAt, 'med')}
      </p>
      {#if document.tags?.length}
        <span>{document.tags[0].title.toLowerCase()}</span>
      {/if}
      <p>{$t('{views} views', { views: $parseViews((document.views ?? 0) + 1) })}</p>
    </div>

    <h1 class:underline={hovered}>{document.title}</h1>
  </a>
</Hoverable>

<style lang="scss">
  @import '@styles/mixins';

  a {
    @apply w-full rounded-md;

    @include focus-state;
  }

  div {
    @apply flex flex-row items-center justify-start gap-3 pb-2 pt-0.5 font-mono text-sm text-dark/80 transition-colors;

    @include dark {
      @apply text-light/80;
    }

    .small & {
      @apply pb-1.5;
    }

    span {
      @apply rounded-sm bg-dark/10 px-1.5 py-0.5 font-code text-sm transition-colors;

      @include dark {
        @apply bg-light/10;
      }
    }
  }

  h1 {
    @apply min-w-fit text-xl font-bold decoration-accent-light decoration-[3px] underline-offset-4 transition-colors;

    @include dark {
      @apply decoration-accent-dark;
    }

    .small & {
      @apply text-lg decoration-2 underline-offset-2;
    }
  }
</style>
