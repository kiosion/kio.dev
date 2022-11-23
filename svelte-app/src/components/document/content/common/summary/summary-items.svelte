<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { Heading } from '$helpers/pt';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let headings: Heading[];
  export let classes = '';
</script>

<div
  class="relative flex flex-col items-start justify-start w-full gap-4 h-fit overflow-hidden text-ellipsis {classes}"
>
  {#each headings as heading}
    <Hoverable>
      <a
        href={`#${heading.key}`}
        class="block select-none w-full px-4 text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis text-[15px]"
        on:click={() => dispatch('click', heading)}
        on:keydown={(e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            dispatch('click', heading);
          }
        }}
      >
        {heading.text}
      </a>
    </Hoverable>
    {#if heading.children.length}
      <svelte:self
        headings={heading.children}
        classes="ml-6"
        on:click={(eventData) => dispatch('click', eventData)}
      />
    {/if}
  {/each}
</div>
