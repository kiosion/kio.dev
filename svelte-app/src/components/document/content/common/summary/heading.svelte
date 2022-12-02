<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import { t } from '$i18n';

  export let headingsExist = false,
    floating = false,
    closeButton: HTMLDivElement | undefined;

  const dispatch = createEventDispatcher();

  let closeHovered: boolean,
    expanded = false;
</script>

<Hoverable classes={headingsExist ? '' : 'not-allowed'}>
  <div
    class="flex flex-row items-center justify-between py-4 px-4 rounded-md focusOutline-sm"
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
    <div class="flex flex-row items-center justify-start gap-3 w-fit">
      <Icon icon="List" />
      <h3 class="font-lg font-bold select-none">{t('Summary')}</h3>
    </div>
    {#if floating}
      <div class="flex flex-row items-center justify-center gap-3 w-fit ">
        <Icon
          icon="ChevronDown"
          classes="{expanded ? 'rotate-0' : 'rotate-90'} transition-all"
        />
        <Hoverable bind:hovered={closeHovered}>
          <div
            role="button"
            on:click={(e) => {
              e.cancelBubble = true;
              dispatch('hide');
            }}
            on:keydown={(e) => {
              if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                e.cancelBubble = true;
                dispatch('hide');
              }
            }}
            bind:this={closeButton}
          >
            <Icon
              icon="Close"
              classes="{closeHovered
                ? 'text-emerald-400 dark:text-emerald-300'
                : ''} transition-none"
            />
          </div>
        </Hoverable>
      </div>
    {:else}
      <Icon
        icon="ChevronDown"
        classes="{expanded ? 'rotate-0' : 'rotate-90'} transition-all"
      />
    {/if}
  </div>
</Hoverable>
