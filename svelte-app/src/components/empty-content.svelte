<script lang="ts">
  import { t } from '$lib/i18n';

  import ExclamationCircle from '$components/icons/exclamation-circle.svelte';
</script>

<div
  class="mb-2 mt-8 flex w-full select-none flex-row items-center justify-start gap-x-3 px-8"
  data-test-id="error-text"
>
  <ExclamationCircle />
  <p class="font-sans text-md font-medium">
    {$t('errors.no-content.message')}
  </p>
</div>
