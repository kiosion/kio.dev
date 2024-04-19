<script lang="ts">
  import { t } from '$lib/i18n';

  import Icon from '$components/icon.svelte';
</script>

<div
  class="my-8 mb-2 mt-8 flex h-fit w-full select-none flex-row items-center justify-start gap-3"
  data-test-id="error-text"
>
  <Icon name="Downasaur"></Icon>
  <p class="font-code text-lg font-bold">{$t('Hm, it seems empty around here...')}</p>
</div>
