<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

{#if data._type === 'project' && data.github}
  <div class="border-t border-dark/80 p-6 dark:border-light/60 md:px-10 print:hidden">
    <h1 class="my-4 text-2xl font-bold">{$t('Links')}</h1>
    <span class="flex items-center justify-start gap-2 text-base">
      <Icon name="GitCommit" inline />
      <Link href={data.github}>
        {'github.com/' + data.github.split('github.com/')?.[1]}
      </Link>
    </span>
  </div>
{/if}

<div class="border-t border-dark/80 p-6 dark:border-light/60 md:px-10 print:hidden">
  <ArrowButton
    href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
    align="left"
    fullWidth
    preload
  >
    <span class="flex items-center justify-start gap-2 font-mono text-sm">
      {#key $isMobile}
        <Icon name={$isMobile ? 'ArrowUp' : 'ArrowLeft'} inline />
      {/key}
      <p>{$t('Read more')}</p>
    </span>
  </ArrowButton>
</div>
