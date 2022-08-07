<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';
  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';

  export let portableText: BlockComponentProps;

  $: ({ value } = portableText);
  $: ({ style } = value);
  $: precededByHeading =
    value?.style && ['h1', 'h2', 'h3', 'h4', 'h5'].includes(value.style);
  $: anchorId = `heading-${value._key}`;

  let hovering = false;
</script>

<div
  class="relative inline-block {precededByHeading ? 'mt-8' : 'mt-4'} {style &&
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
          class="relative top-1/4 text-slate-700 dark:text-white hover:text-slate-300 hover:dark:text-slate-300"
        />
      </span>
    {/if}
    {#if style === 'h1'}
      <h1 class="inline font-display text-4xl font-bold"><slot /></h1>
    {:else if style === 'h2'}
      <h2 class="inline font-display text-3xl font-bold"><slot /></h2>
    {:else if style === 'h3'}
      <h3 class="inline font-display text-2xl font-bold"><slot /></h3>
    {:else if style === 'h4'}
      <h4 class="inline font-display text-xl font-bold"><slot /></h4>
    {:else}
      <h5 class="font-sans text-lg font-bold text-slate-500"><slot /></h5>
    {/if}
  </a>
</div>
