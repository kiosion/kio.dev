<script lang="ts">
  import { onMount } from 'svelte';

  import { BASE_GIT_URL } from '$lib/consts';

  import Divider from '$components/divider.svelte';
  import Cursor from '$components/experiments/mag-cursor/cursor.svelte';
  import CursorTarget from '$components/experiments/mag-cursor/target.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';

  let container: HTMLElement, containerRect: DOMRect;

  const buttons = ['Button One', 'Button Two', 'Button Three'];

  const updateRect = () => (containerRect = container?.getBoundingClientRect());

  onMount(updateRect);
</script>

<svelte:window on:resize={updateRect} on:scroll={updateRect} />

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<article
  class="relative my-6 block cursor-none rounded-lg bg-dark/5 px-7 py-6 shadow-2xl shadow-dark/5 transition-shadow focus-within:shadow-dark/10 hover:shadow-dark/10 dark:bg-light/5 dark:shadow-light/5"
  on:mouseover={updateRect}
  bind:this={container}
>
  <header class="w-full pb-2">
    <h3 class="pb-2 text-2xl font-bold">Magnetic cursor</h3>
    <p>A simple magnetic cursor effect. Hover over the buttons to try it out.</p>
    <Divider />
  </header>

  <CursorTarget distance={40} let:active let:offset>
    <Link
      href="{BASE_GIT_URL}/blob/main/svelte-app/src/components/experiments/mag-cursor.svelte"
      class="focus-outline absolute right-4 top-4 z-10 cursor-none rounded-sm p-2"
      tooltipDelay={150}
      tooltipText="View source"
      newtab
      style="transform: translate({offset?.[0]}px, {offset?.[1]}px)"
    >
      <Icon
        name="ExternalLink"
        size={21}
        class="hover:text-accent-light/90 focus-visible:text-accent-light/90 hover:dark:text-accent-dark/90 focus-visible:dark:text-accent-dark/90 {active
          ? 'text-accent-light/90 dark:text-accent-dark/90'
          : 'text-dark/90 dark:text-light/90'}"
      />
    </Link>
  </CursorTarget>

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

    <Cursor {containerRect} />
  </figure>
</article>
