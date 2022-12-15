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
  class="relative flex flex-col items-start justify-start w-full h-fit text-ellipsis {classes}"
>
  {#each headings as heading}
    <Hoverable>
      <a
        href={`#${heading.key}`}
        class="block select-none w-full p-1 mx-4 my-2 text-sm font-medium whitespace-nowrap text-ellipsis text-[15px] overflow-hidden rounded-sm focusOutline-sm"
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
