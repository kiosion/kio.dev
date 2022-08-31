<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';
  import { fade } from 'svelte/transition';
  import Divider from '$components/divider.svelte';
  import Link from 'pixelarticons/svg/link.svg';

  export let portableText: BlockComponentProps;

  let hovering = false;

  $: ({ value } = portableText);
  $: ({ style } = value);
  $: precededByHeading =
    value?.style && ['h1', 'h2', 'h3', 'h4', 'h5'].includes(value.style);
  $: anchorId = `heading-${value._key}`;
</script>

<div
  class="relative block {precededByHeading ? 'mt-6' : 'mt-4'} {style &&
  ['h1', 'h2'].indexOf(style) !== -1
    ? 'mt-8 mb-6'
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
        <div class="relative top-[20%] right-[10%]">
          <Link width="20" />
        </div>
      </span>
    {/if}
    {#if style === 'h1'}
      <h1 class="inline font-display text-4xl font-bold" tabindex="0">
        <slot />
      </h1>
    {:else if style === 'h2'}
      <h2 class="inline font-display text-3xl font-bold" tabindex="0">
        <slot />
      </h2>
    {:else if style === 'h3'}
      <h3 class="inline font-display text-2xl font-bold" tabindex="0">
        <slot />
      </h3>
    {:else if style === 'h4'}
      <h4 class="inline font-display text-xl font-bold" tabindex="0">
        <slot />
      </h4>
    {:else}
      <h5 class="inline font-display text-lg font-bold" tabindex="0">
        <slot />
      </h5>
    {/if}
  </a>
</div>
<!-- {#if style && ['h1', 'h2'].indexOf(style) !== -1}
  <Divider />
{/if} -->
