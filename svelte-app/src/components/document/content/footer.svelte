<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import Link from '$components/link.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

<BaseContainer>
  {#if data._type === 'project' && data.github}
    <div class="border-t border-dark/80 p-6 dark:border-light/60 md:px-10 print:hidden">
      <h1 class="my-4 text-2xl font-bold">{$t('Links')}</h1>
      <span class="flex items-center justify-start gap-2 text-base">
        <span
          class="cursor-default select-none font-mono text-sm text-dark/80 dark:text-light/80"
          >git /</span
        >
        <Link href={data.github}>
          {'github.com/' + data.github.split('github.com/')?.[1]}
        </Link>
      </span>
    </div>
  {/if}

  <div class="flex flex-row gap-3 p-2 print:hidden">
    <ArrowButton
      href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
      dir={$isMobile ? 'up' : 'left'}
      text={$t('All posts')}
      preload
    />
  </div>
</BaseContainer>
