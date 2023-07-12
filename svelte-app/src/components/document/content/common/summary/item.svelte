<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import sfx from '$lib/sfx';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';

  import type { Heading } from '$helpers/pt';

  const dispatch = createEventDispatcher();

  export let headings: Heading[],
    classNames = '';

  $: localHeadings = headings as (Heading & { active: boolean })[];
</script>

<div
  class="relative flex h-fit w-full flex-col items-start justify-start text-ellipsis {classNames}"
>
  {#each localHeadings as heading}
    <Hoverable bind:hovered={heading.active}>
      <a
        href={`#${heading.key}`}
        class="focusOutline-sm"
        class:active={heading.active}
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
        <BulletPoint />
        {heading.text}
      </a>
    </Hoverable>
    {#if heading.children.length}
      <svelte:self
        headings={heading.children}
        classNames="ml-6"
        on:click={(eventData) => dispatch('click', eventData)}
      />
    {/if}
  {/each}
</div>

<style lang="scss">
  a {
    @apply ml-3 flex w-full select-none flex-row items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm py-[.65rem] text-[15px] text-sm font-medium text-dark/80 transition-[color];

    &.active {
      @apply text-dark;
    }
  }

  :global(.dark) {
    a {
      @apply text-light/80;

      &.active {
        @apply text-light;
      }
    }
  }
</style>
