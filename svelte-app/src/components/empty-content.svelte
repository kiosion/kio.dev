<script lang="ts">
  import ExclamationCircle from '$components/icons/exclamation-circle.svelte';
  import { t } from '$lib/i18n';
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
