<script lang="ts">
  import { currentLang, linkTo, t } from '$i18n';
  import { formatDate } from '$lib/helpers/date';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let document: PostDocument | ProjectDocument,
    type = document._type,
    external = document._type === 'project' ? document.external : false,
    small = false;

  let hovered = false;

  const link =
    document._type === 'post'
      ? `/blog/${document.slug.current}`
      : external
      ? document.externalUrl ?? `/work/${document.slug.current}`
      : `/work/${document.slug.current}`;
</script>

<Hoverable bind:hovered>
  {#if small}
    <a
      href={$linkTo(link)}
      target={external ? '_blank' : undefined}
      class="focusOutline flex w-full flex-row items-start justify-start gap-2 rounded-sm"
      tabindex="0"
      data-sveltekit-preload-code
      data-sveltekit-preload-data
    >
      <p
        class="mt-0.5 block w-[72px] flex-shrink-0 font-mono text-sm transition-colors"
        aria-label={$t('Date posted')}
      >
        {formatDate(document.date || document._createdAt, 'med', $currentLang)}
      </p>
      <p
        class="block text-base text-black decoration-accent-light decoration-2 underline-offset-2 transition-colors dark:text-white dark:decoration-accent-dark"
        class:underline={hovered}
      >
        {document.title}
      </p>
    </a>
  {:else}
    <a
      href={$linkTo(link)}
      target={external ? '_blank' : undefined}
      class="focusOutline flex w-full flex-col items-start justify-start gap-2 rounded-md"
      tabindex="0"
      data-sveltekit-preload-code
      data-sveltekit-preload-data
    >
      <div class="flex flex-row gap-4">
        <p class="mt-0.5 block w-14 flex-shrink-0 font-code text-base transition-colors">
          {formatDate(document.date || document._createdAt, 'dayMonth', $currentLang)}
        </p>
        <div class="flex flex-row items-center justify-start gap-2 transition-colors">
          <h1
            class="min-w-fit font-display text-lg font-medium decoration-accent-light decoration-[3px] underline-offset-4 dark:decoration-accent-dark"
            class:underline={hovered}
          >
            {document.title}
          </h1>
          {#if type === 'project' && document.desc}
            <BulletPoint class="flex-shrink-0" />
            <p class="line-clamp-1 text-base">{document.desc}</p>
          {/if}
        </div>
      </div>
    </a>
  {/if}
</Hoverable>
