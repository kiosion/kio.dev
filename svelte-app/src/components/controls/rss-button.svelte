<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';
  import { t } from '$i18n';
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
</script>

<Hoverable>
  <Tooltip text={$t('Subscribe to RSS')} delay={150} fixed>
    <button
      class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400"
      aria-label={$t('Subscribe to RSS Feed')}
      data-test-id="rss-button"
      tabindex="0"
      on:click={() => {
        goto('/rss');
      }}
      on:keyup={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          goto('/rss');
        }
      }}
    >
      <Icon icon={'RadioSignal'} width={19} />
    </button>
  </Tooltip>
</Hoverable>
