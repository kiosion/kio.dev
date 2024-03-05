<script lang="ts">
  import { BASE_GIT_URL } from '$lib/consts';

  import Divider from '$components/divider.svelte';
  import MagCursor from '$components/experiments/mag-cursor/cursor.svelte';
  import MagTarget from '$components/experiments/mag-cursor/target.svelte';
  import Icon from '$components/icon.svelte';
  import Link from '$components/link.svelte';

  let container: HTMLElement,
    containerRect: DOMRect,
    targets: { element: HTMLElement | undefined; id: string }[] = [],
    activeTarget: string | undefined = undefined;

  const buttons = ['Button One', 'Button Two', 'Button Three'];
</script>

<svelte:window on:resize={() => (containerRect = container?.getBoundingClientRect())} />

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<article
  class="relative my-6 block cursor-none rounded-lg bg-dark/5 px-7 py-6 shadow-2xl shadow-dark/5 transition-shadow focus-within:shadow-dark/10 hover:shadow-dark/10 dark:bg-light/5 dark:shadow-light/5"
  on:mouseover={() => (containerRect = container?.getBoundingClientRect())}
  bind:this={container}
>
  <header class="w-full pb-2">
    <h3 class="pb-2 text-2xl font-bold">Magnetic cursor</h3>
    <p>A simple magnetic cursor effect. Hover over the buttons to try it out.</p>
    <Divider />
  </header>

  <MagTarget
    {activeTarget}
    snapDistance={46}
    let:active
    on:mount={(e) => targets.push({ ...e.detail })}
  >
    <Link
      href="{BASE_GIT_URL}/blob/main/svelte-app/src/components/experiments/mag-cursor.svelte"
      class="focus-outline absolute right-4 top-4 z-10 cursor-none rounded-sm p-2"
      tooltipDelay={150}
      tooltipText="View source"
      newtab
    >
      <Icon
        name="ExternalLink"
        size={21}
        class="hover:text-accent-light/90 focus-visible:text-accent-light/90 hover:dark:text-accent-dark/90 focus-visible:dark:text-accent-dark/90 {active
          ? 'text-accent-light/90 dark:text-accent-dark/90'
          : 'text-dark/90 dark:text-light/90'}"
      />
    </Link>
  </MagTarget>

  <figure class="h-fit w-full overflow-hidden">
    <div class="flex w-full flex-row items-center justify-center pb-8 pt-7">
      {#each buttons as label}
        <MagTarget
          let:active
          {activeTarget}
          on:mount={(e) => targets.push({ ...e.detail })}
          ><button
            class="focus-outline-sm cursor-none select-none rounded-lg px-3 py-2 font-code text-base transition-colors active:text-accent-light/80 dark:active:text-accent-dark/80 {active
              ? 'text-accent-light dark:text-accent-dark'
              : ''}"
            tabindex="0">{label}</button
          ></MagTarget
        >
      {/each}
    </div>

    <MagCursor {targets} {containerRect} bind:activeTarget />
  </figure>
</article>
