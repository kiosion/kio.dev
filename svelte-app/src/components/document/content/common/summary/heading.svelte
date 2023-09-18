<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { t } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  export let headingsExist = false;

  const dispatch = createEventDispatcher();

  let expanded = false;
</script>

<Hoverable class={headingsExist ? '' : 'not-allowed'}>
  <Tooltip text={$t('Toggle summary')} fixed>
    <div
      class="focusOutline-sm flex flex-row items-center justify-between rounded-md px-4 py-4"
      role="button"
      tabindex="0"
      on:click={(_) => {
        if (headingsExist) {
          expanded = !expanded;
          dispatch('toggle');
        }
      }}
      on:keydown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          if (headingsExist) {
            expanded = !expanded;
            dispatch('toggle');
          }
        }
      }}
    >
      <div class="flex w-fit flex-row items-center justify-start gap-3">
        <Icon icon="List" />
        <h3 class="font-lg select-none font-bold">{$t('Summary')}</h3>
      </div>
      <Icon
        icon="ChevronDown"
        class="{expanded ? 'rotate-0' : 'rotate-90'} transition-all"
      />
    </div>
  </Tooltip>
</Hoverable>
