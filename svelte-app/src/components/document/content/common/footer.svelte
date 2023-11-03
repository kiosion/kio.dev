<script lang="ts">
  import { linkTo, t } from '$i18n';
  import { isMobile } from '$lib/helpers/responsive';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Icon from '$components/icon.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

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
