<script lang="ts">
  import { onMount } from 'svelte';

  import { BASE_GIT_URL } from '$lib/consts';
  import { t } from '$lib/i18n';

  import Divider from '$components/divider.svelte';
  import Cursor from '$components/experiments/mag-cursor/cursor.svelte';
  import CursorTarget from '$components/experiments/mag-cursor/target.svelte';
  import Link from '$components/link.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  let container: HTMLElement, containerRect: DOMRect;

  const buttons = ['Button One', 'Button Two', 'Button Three'];

  const updateRect = () => (containerRect = container?.getBoundingClientRect());

  let useOffset = false;

  onMount(updateRect);
</script>

<svelte:window on:resize={updateRect} on:scroll={updateRect} />

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<article
  class="relative my-6 block cursor-none rounded-lg bg-dark/5 px-7 py-6 shadow-2xl shadow-dark/5 transition-shadow focus-within:shadow-dark/10 hover:shadow-dark/10 dark:bg-light/5 dark:shadow-light/5"
  on:mouseover={updateRect}
  bind:this={container}
>
  <header class="flex w-full flex-col pb-2">
    <div class="flex flex-row items-start justify-between">
      <h3 class="pb-2 font-display text-2xl font-bold">{$t('Magnetic cursor')}</h3>
      <div class="flex flex-row gap-x-6">
        <CursorTarget distance={40} let:active let:offset>
          <Tooltip
            placement="top"
            content={useOffset ? "Disable 'pulling' targets" : "Enable 'pulling' targets"}
          >
            <button
              class="-m-2 h-fit w-fit cursor-none p-2 font-mono text-sm hover:text-orange-light/90 focus-visible:text-orange-light/90 {active
                ? 'text-orange-light/90'
                : 'text-dark/80 dark:text-light/80'}"
              on:click={() => (useOffset = !useOffset)}
              on:keyup={(e) => e.key === 'Enter' && (useOffset = !useOffset)}
              role="switch"
              aria-checked={useOffset}
              style="transform: translate({offset?.[0]}px, {offset?.[1]}px)"
              type="button"
            >
              <!-- eslint-disable-next-line -->
              [{#if useOffset}x{:else}&nbsp;{/if}]
            </button>
          </Tooltip>
        </CursorTarget>
        <CursorTarget distance={40} let:active let:offset>
          <Link
            href="{BASE_GIT_URL}/blob/main/svelte-app/src/components/experiments/mag-cursor.svelte"
            class="focus-outline z-10 -m-2 cursor-none rounded-xs p-2 font-mono text-sm hover:text-orange-light/90 focus-visible:text-orange-light/90 {active &&
              'text-orange-light'}"
            tooltipText="View source"
            tooltipPosition="top"
            newtab
            style="transform: translate({offset?.[0]}px, {offset?.[1]}px)"
            >[{$t('code')}]</Link
          >
        </CursorTarget>
      </div>
    </div>
    <p>{$t('A simple magnetic cursor effect. Hover over the buttons to try it out.')}</p>
    <Divider></Divider>
  </header>

  <figure class="h-fit w-full overflow-hidden">
    <div class="flex w-full flex-row items-center justify-center gap-2 pb-10 pt-8">
      {#each buttons as label}
        <CursorTarget let:active let:offset
          ><button
            class="focus-outline-sm cursor-none select-none rounded-lg px-4 py-3 font-mono text-sm transition-colors active:text-orange-light/80 dark:active:text-orange-light/80 {active
              ? ' text-orange-light dark:text-orange-light'
              : ''}"
            tabindex="0"
            type="button"
          >
            <div style="transform: translate({offset?.[0]}px, {offset?.[1]}px)">
              {label}
            </div></button
          ></CursorTarget
        >
      {/each}
    </div>

    <Cursor {containerRect} {useOffset}></Cursor>
  </figure>
</article>
