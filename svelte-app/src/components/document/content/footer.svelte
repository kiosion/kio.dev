<script lang="ts">
  import { linkTo, t } from '$lib/i18n';
  import { isMobile } from '$lib/responsive';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
</script>

<BaseContainer>
  <div class="flex flex-row gap-3 p-2 print:hidden">
    <ArrowButton
      href={$linkTo('/thoughts')}
      dir={$isMobile ? 'up' : 'left'}
      text={$t('All posts')}
      preload-code
    />
  </div>
</BaseContainer>
