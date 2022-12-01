<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value } = portableText);
  $: ({ style } = value);
</script>

<Hoverable>
  <a
    class="block {style && ['h1', 'h2'].indexOf(style) !== -1
      ? 'mt-12 mb-6'
      : 'mt-6 mb-2'}"
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    {#if style === 'h1'}
      <h1 class="inline font-display text-4xl font-bold">
        <slot />
      </h1>
    {:else if style === 'h2'}
      <h2 class="inline font-display text-3xl font-bold">
        <slot />
      </h2>
    {:else if style === 'h3'}
      <h3 class="inline font-display text-2xl font-bold">
        <slot />
      </h3>
    {:else if style === 'h4'}
      <h4 class="inline font-display text-xl font-bold">
        <slot />
      </h4>
    {:else}
      <h5 class="inline font-display text-lg font-bold">
        <slot />
      </h5>
    {/if}
  </a>
</Hoverable>
