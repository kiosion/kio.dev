<script lang="ts">
  import { linkTo, t } from '$i18n';
  import { isMobile } from '$lib/helpers/responsive';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

{#if data._type === 'project' && data.github}
  <div>
    <h1 class="my-4 font-display text-2xl font-bold">{$t('Links')}</h1>
    <span class="flex items-center justify-start gap-2 text-base">
      <Icon icon="ExternalLink" class="mb-0.5" inline />
      <Link href={data.github}>
        {'github/' + data.github.split('github.com/')?.[1]}
      </Link>
    </span>
  </div>
  <Divider />
{/if}
<div>
  <ArrowButton
    class="w-full text-left"
    href={model === 'post' ? $linkTo('/blog') : $linkTo('/work')}
    preload
  >
    <span class="flex items-center justify-start gap-2 text-base">
      {#key $isMobile}
        <Icon icon={$isMobile ? 'ArrowUp' : 'ArrowLeft'} class="mb-0.5" inline />
      {/key}
      <p>{$t('Read more')}</p>
    </span>
  </ArrowButton>
</div>
