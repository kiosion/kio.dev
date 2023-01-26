<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { t } from '$i18n';
</script>

<div data-test-route="work" class="w-full pb-20 max-w-[80rem] mx-auto">
  <PageHeading
    heading={t('Work')}
    text={t(
      'A collection of my work, open-source contributions, and personal projects'
    )}
  />
  <slot />
</div>
