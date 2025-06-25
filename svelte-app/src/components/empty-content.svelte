<script lang="ts">
  import ExclamationCircle from '$components/icons/exclamation-circle.svelte';
  import { t } from '$lib/i18n';
</script>

<div
  class="mt-8 mb-2 flex w-full flex-row items-center justify-start gap-x-3 px-8 select-none"
  data-test-id="error-text"
>
  <ExclamationCircle />
  <p class="text-md font-sans font-medium">
    {$t('errors.no-content.message')}
  </p>
</div>
