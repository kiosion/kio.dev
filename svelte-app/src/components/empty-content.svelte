<script lang="ts">
  import { t } from '$lib/i18n';
</script>

<div class="mb-2 mt-8 w-full select-none px-8" data-test-id="error-text">
  <p class="font-mono text-base">
    <span class="text-sm">[!]</span>
    {$t('errors.no-content.message')}
  </p>
</div>
