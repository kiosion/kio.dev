<script lang="ts">
  import { onMount } from 'svelte';

  import Divider from '$components/divider.svelte';
  import Cursor from '$components/experiments/mag-cursor/cursor.svelte';
  import CursorTarget from '$components/experiments/mag-cursor/target.svelte';
  import Link from '$components/link.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { BASE_GIT_URL } from '$lib/consts';
  import { t } from '$lib/i18n';

  let container: HTMLElement, containerRect: DOMRect;

  const buttons = ['Button One', 'Button Two', 'Button Three'];

  const updateRect = () => (containerRect = container?.getBoundingClientRect());

  let useOffset = false;

  onMount(updateRect);
</script>

<svelte:window on:resize={updateRect} on:scroll={updateRect} />

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<article
  class="bg-dark/5 shadow-dark/5 focus-within:shadow-dark/10 hover:shadow-dark/10 dark:bg-light/5 dark:shadow-light/5 relative my-6 block cursor-none rounded-lg px-7 py-6 shadow-2xl transition-shadow"
  on:mouseover={updateRect}
  bind:this={container}
>
  <header class="flex w-full flex-col pb-2">
    <div class="flex flex-row items-start justify-between">
      <h3 class="font-display pb-2 text-2xl font-bold">{$t('Magnetic cursor')}</h3>
      <div class="flex flex-row gap-x-6">
        <CursorTarget distance={40} let:active let:offset>
          <Tooltip
            placement="top"
            content={useOffset ? "Disable 'pulling' targets" : "Enable 'pulling' targets"}
          >
            <button
              class="hover:text-orange-light/90 focus-visible:text-orange-light/90 -m-2 h-fit w-fit cursor-none p-2 font-mono text-sm {active
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
            class="focus-outline hover:text-orange-light/90 focus-visible:text-orange-light/90 z-10 -m-2 cursor-none rounded-xs p-2 font-mono text-sm {active &&
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
    <div class="flex w-full flex-row items-center justify-center gap-2 pt-8 pb-10">
      {#each buttons as label}
        <CursorTarget let:active let:offset
          ><button
            class="focus-outline-sm active:text-orange-light/80 dark:active:text-orange-light/80 cursor-none rounded-lg px-4 py-3 font-mono text-sm transition-colors select-none {active
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
