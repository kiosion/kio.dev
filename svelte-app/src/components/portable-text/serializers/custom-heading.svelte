<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';
  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';
  import Divider from '@/components/divider.svelte';

  export let portableText: BlockComponentProps;

  $: ({ value } = portableText);
  $: ({ style } = value);
  $: precededByHeading =
    value?.style && ['h1', 'h2', 'h3', 'h4', 'h5'].includes(value.style);
  $: anchorId = `heading-${value._key}`;

  let hovering = false;
</script>

<div
  class="relative block {precededByHeading ? 'mt-6' : 'mt-4'} {style &&
  ['h1', 'h2'].indexOf(style) !== -1
    ? 'mb-4'
    : 'mb-2'}"
  id={anchorId}
  on:mouseover={() => (hovering = true)}
  on:focus={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:blur={() => (hovering = false)}
>
  <a class="contents" href="#{anchorId}">
    {#if hovering}
      <span
        class="absolute h-full -translate-x-6"
        in:fade={{ duration: 50 }}
        out:fade={{ duration: 50 }}
      >
        <span class="sr-only">Link to this heading</span>
        <Icon
          icon="fa-solid:link"
          class="relative top-1/4 text-slate-800 dark:text-slate-100"
        />
      </span>
    {/if}
    {#if style === 'h1'}
      <h1 class="inline font-mono text-3xl font-bold"><slot /></h1>
    {:else if style === 'h2'}
      <h2 class="inline font-mono text-3xl font-bold"><slot /></h2>
    {:else if style === 'h3'}
      <h3 class="inline font-mono text-2xl font-bold"><slot /></h3>
    {:else if style === 'h4'}
      <h4 class="inline font-mono text-xl font-bold"><slot /></h4>
    {:else}
      <h5 class="inline font-mono text-lg font-bold"><slot /></h5>
    {/if}
  </a>
</div>
{#if style === 'h1'}
  <Divider />
{/if}
