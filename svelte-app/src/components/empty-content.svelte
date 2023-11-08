<script lang="ts">
  import { t } from '$i18n';

  import Icon from '$components/icon.svelte';
</script>

<div data-test-id="error-text">
  <Icon icon="Downasaur" />
  <p>{$t('Hm, it seems empty around here...')}</p>
</div>

<style lang="scss">
  div {
    @apply my-8 mb-2 mt-8 flex h-fit w-full select-none flex-row items-center justify-start gap-3;
  }

  p {
    @apply font-code text-lg font-bold;
  }
</style>
