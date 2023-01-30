<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { t } from '$i18n';
</script>

<div data-test-route="work" class="mx-auto w-full max-w-[80rem] pb-20">
  <PageHeading
    heading={t('Work')}
    text={t(
      'A collection of my work, open-source contributions, and personal projects'
    )}
  />
  <slot />
</div>
