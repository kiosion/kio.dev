<script lang="ts">
  import SummaryItems from '$components/document/content/common/summary/summary-items.svelte';
  import { t } from '$i18n';
  import { slide } from 'svelte/transition';
  import type { Heading } from '$helpers/pt';
  import SafeIcon from '$components/icons/safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import { createEventDispatcher } from 'svelte';
  import Divider from '$components/context-menu/divider.svelte';

  const dispatch = createEventDispatcher();

  export let headings: Heading[];
  export let floating = false;
  export let expanded = false;
  export let visible = true;
  export let showClose = false;

  let hide = false,
    hovered = false,
    closeButton: HTMLElement | undefined;

  $: headingsExist = headings.length > 0;
</script>

<div
  class="{hide && 'hidden'} {!visible && 'opacity-0'} rounded-md {floating
    ? 'bg-slate-200/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg'
    : 'bg-slate-200 dark:bg-slate-900'} shadow-slate-300/50 dark:shadow-slate-900/50 z-[5] transition-[background-color,box-shadow,color,opacity]"
>
  <Hoverable classes={headingsExist ? '' : 'not-allowed'}>
    <div
      class="flex flex-row items-center justify-between py-4 px-4"
      role="button"
      tabindex="0"
      on:click={(e) => headingsExist && (expanded = !expanded)}
      on:keydown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          headingsExist && (expanded = !expanded);
        }
      }}
    >
      <div class="flex flex-row items-center justify-start gap-3 w-fit">
        <SafeIcon icon="List" />
        <h3 class="font-lg font-bold select-none">{t('Table of Contents')}</h3>
      </div>
      {#if showClose}
        <div class="flex flex-row items-center justify-center gap-3 w-fit ">
          <SafeIcon
            icon="ChevronDown"
            classes="{expanded ? 'rotate-0' : 'rotate-90'} transition-all"
          />
          <Hoverable bind:hovered>
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
              <SafeIcon
                icon="Close"
                classes="{hovered
                  ? 'text-emerald-400 dark:text-emerald-300'
                  : ''} transition-none"
              />
            </div>
          </Hoverable>
        </div>
      {:else}
        <SafeIcon
          icon="ChevronDown"
          classes="{expanded ? 'rotate-0' : 'rotate-90'} transition-all"
        />
      {/if}
    </div>
  </Hoverable>
  {#if expanded}
    <div
      class="mx-7 px-1 pb-6 h-fit overflow-hidden"
      in:slide={{ duration: 400 }}
      out:slide={{ duration: 400 }}
    >
      <Divider classes="mb-5" />
      {#if headingsExist}
        <SummaryItems
          {headings}
          on:click={() => floating && (expanded = false)}
        />
      {/if}
    </div>
  {/if}
</div>
