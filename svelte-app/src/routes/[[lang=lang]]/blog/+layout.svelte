<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { t } from '$i18n';
</script>

<div data-test-route="blog" class="mx-auto w-full max-w-[80rem] pb-20">
  <PageHeading
    heading={t('Blog')}
    text={t('Thoughts about tech, design, and development')}
  />
  <slot />
</div>
