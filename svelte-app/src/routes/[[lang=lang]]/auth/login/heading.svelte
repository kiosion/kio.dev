<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import Icon from '$components/icon.svelte';
  import { t } from '$i18n';

  export let title: string,
    text: string,
    icon = 'ArrowRight',
    loading = false;
</script>

<PageHeading heading={t(title)}>
  <span class="flex flex-row items-center gap-3">
    {#if loading}
      <Spinner />
    {:else}
      <Icon {icon} classNames="mt-0.5" />
    {/if}
    <p class="font-code text-base">{t(text)}</p>
  </span>
</PageHeading>

<style lang="postcss">
</style>
