<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import sfx from '$lib/sfx';
  import Hoverable from '$components/hoverable.svelte';
  import type { Heading } from '$helpers/pt';

  const dispatch = createEventDispatcher();

  export let headings: Heading[];
  export let classes = '';
</script>

<div
  class="relative flex h-fit w-full flex-col items-start justify-start text-ellipsis {classes}"
>
  {#each headings as heading}
    <Hoverable>
      <a
        href={`#${heading.key}`}
        class="focusOutline-sm mx-4 my-2 block w-full select-none overflow-hidden text-ellipsis whitespace-nowrap rounded-sm p-1 text-sm text-[15px] font-medium"
        on:click={() => {
          sfx.click.play();
          dispatch('click', heading);
        }}
        on:keydown={(e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            sfx.click.play();
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
