<script lang="ts">
  import { onMount } from 'svelte';

  import { BASE_GIT_URL } from '$lib/consts';

  import Divider from '$components/divider.svelte';
  import Cursor from '$components/experiments/mag-cursor/cursor.svelte';
  import CursorTarget from '$components/experiments/mag-cursor/target.svelte';
  import Icon from '$components/icon.svelte';
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
      <h3 class="pb-2 text-2xl font-bold">Magnetic cursor</h3>
      <div class="flex flex-row gap-x-6">
        <CursorTarget distance={40} let:active let:offset>
          <Tooltip
            position="top"
            text={useOffset ? "Disable 'pulling' targets" : "Enable 'pulling' targets"}
          >
            <button
              class="-m-2 h-fit w-fit cursor-none p-2 hover:text-accent-light/90 focus-visible:text-accent-light/90 hover:dark:text-accent-dark/90 focus-visible:dark:text-accent-dark/90 {active
                ? 'text-accent-light/90 dark:text-accent-light/90'
                : 'text-dark/80 dark:text-light/80'}"
              on:click={() => (useOffset = !useOffset)}
              on:keyup={(e) => e.key === 'Enter' && (useOffset = !useOffset)}
              role="switch"
              aria-checked={useOffset}
              style="transform: translate({offset?.[0]}px, {offset?.[1]}px)"
            >
              {#if useOffset}
                <svg
                  class="h-6 w-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 5h16v2H4V5zm0 12H2V7h2v10zm16 0v2H4v-2h16zm0 0h2V7h-2v10zm-2-8h-4v6h4V9z"
                    fill="currentColor"
                  />
                </svg>
              {:else}
                <svg
                  class="h-6 w-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 5h16v2H4V5zm0 12H2V7h2v10zm16 0v2H4v-2h16zm0 0h2V7h-2v10zM10 9H6v6h4V9z"
                    fill="currentColor"
                  />
                </svg>
              {/if}
            </button>
          </Tooltip>
        </CursorTarget>
        <CursorTarget distance={40} let:active let:offset>
          <Link
            href="{BASE_GIT_URL}/blob/main/svelte-app/src/components/experiments/mag-cursor.svelte"
            class="focus-outline z-10 -m-2 cursor-none rounded-sm p-2"
            tooltipDelay={150}
            tooltipText="View source"
            tooltipPosition="top"
            newtab
            style="transform: translate({offset?.[0]}px, {offset?.[1]}px)"
          >
            <Icon name="ExternalLink" size={21} {active} interactive />
          </Link>
        </CursorTarget>
      </div>
    </div>
    <p>A simple magnetic cursor effect. Hover over the buttons to try it out.</p>
    <Divider />
  </header>

  <figure class="h-fit w-full overflow-hidden">
    <div class="flex w-full flex-row items-center justify-center gap-2 pb-10 pt-8">
      {#each buttons as label}
        <CursorTarget let:active let:offset
          ><button
            class="focus-outline-sm cursor-none select-none rounded-lg px-3 py-2 font-code text-base transition-colors active:text-accent-light/80 dark:active:text-accent-dark/80 {active
              ? ' text-accent-light dark:text-accent-dark'
              : ''}"
            tabindex="0"
          >
            <div style="transform: translate({offset?.[0]}px, {offset?.[1]}px)">
              {label}
            </div></button
          ></CursorTarget
        >
      {/each}
    </div>

    <Cursor {containerRect} {useOffset} />
  </figure>
</article>
