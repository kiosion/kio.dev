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

{#if data._type === 'project' && data.github}
  <BaseContainer>
    <div class="px-6 pb-6 md:px-10 print:hidden">
      <h1 class="my-4 text-2xl font-bold">{$t('Links')}</h1>
      <span class="flex items-center justify-start gap-2 text-base">
        <!-- eslint-disable -->
        <span class="select-none text-base text-neutral-700 dark:text-neutral-100"
          >{$t('git')}</span
        >
        <span class="select-none text-base text-neutral-700 dark:text-neutral-100">/</span
        >
        <!-- eslint-enable -->
        <Link href={data.github}>
          {'github.com/' + data.github.split('github.com/')?.[1]}
        </Link>
      </span>
    </div>
  </BaseContainer>
{/if}

<BaseContainer>
  <div class="flex flex-row gap-3 p-2 print:hidden">
    <ArrowButton
      href={model === 'post' ? $linkTo('/thoughts') : $linkTo('/work')}
      dir={$isMobile ? 'up' : 'left'}
      text={model === 'post' ? $t('All posts') : $t('All projects')}
      preload-code
    />
  </div>
</BaseContainer>
