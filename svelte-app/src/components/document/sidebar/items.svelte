<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { Heading } from '$helpers/pt';

  const getTextSize = (level: string) => {
    switch (parseInt(level.charAt(1))) {
      case 1:
        return 'text-[18px]';
      case 2:
        return 'text-[16px]';
      case 3:
        return 'text-[14px]';
      case 4:
        return 'text-[12px]';
      default:
        return 'text-[10px]';
    }
  };

  export let headings: Heading[];
  export let classes = '';
</script>

<div
  class="relative flex flex-col items-start justify-start w-full gap-4 h-fit overflow-hidden text-ellipsis {classes}"
>
  <slot />
  {#each headings as heading}
    <Hoverable>
      <a
        href={`#${heading.key}`}
        class="block w-full px-4 text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis {getTextSize(
          heading.type
        )}"
      >
        {heading.text}
      </a>
    </Hoverable>
    {#if heading.children.length}
      <svelte:self headings={heading.children} classes="pl-[14px]">
        <div
          class="absolute top-0 left-[16px] w-[1px] h-full bg-slate-900/50 dark:bg-slate-200/50 rounded-full"
        />
      </svelte:self>
    {/if}
  {/each}
</div>
