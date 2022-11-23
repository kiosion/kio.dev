<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Divider from '$components/divider.svelte';
  import Summary from '$components/document/content/common/summary/summary.svelte';
  import type { Heading } from '$helpers/pt';
  import { fly } from 'svelte/transition';

  export let headings: Heading[];

  let trigger: HTMLElement,
    visible = true;

  const intersectionObserver = new IntersectionObserver(
    (entries) => (visible = entries[0]?.isIntersecting),
    {
      rootMargin: '-90px 0px 0px 0px',
      threshold: [1]
    }
  );

  onMount(() => intersectionObserver.observe(trigger));
  onDestroy(() => intersectionObserver.disconnect());
</script>

{#if !visible}
  <div
    class="sticky h-0 top-0 md:top-14 z-[5] w-[112%] -translate-x-[5%]"
    in:fly={{ y: -60, duration: 200 }}
    out:fly={{ y: -80, duration: 200 }}
  >
    <Summary
      {headings}
      expanded={false}
      showClose={true}
      floating={true}
      on:hide={() => (visible = true)}
    />
  </div>
{/if}

<Summary {headings} {visible} />

<div class="h-[1px]" bind:this={trigger} />

<Divider />
