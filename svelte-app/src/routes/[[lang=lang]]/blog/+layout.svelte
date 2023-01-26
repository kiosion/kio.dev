<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { t } from '$i18n';
</script>

<div data-test-route="blog" class="w-full pb-20 max-w-[80rem] mx-auto">
  <PageHeading
    heading={t('Blog')}
    text={t('Thoughts about tech, design, and development')}
  />
  <slot />
</div>
