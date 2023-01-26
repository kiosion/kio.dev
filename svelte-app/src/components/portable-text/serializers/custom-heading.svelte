<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  const baseHeadingClasses = 'inline font-display font-bold';

  $: ({ value } = portableText);
  $: ({ style } = value);
</script>

<Hoverable>
  <a
    class="block {style && ['h1', 'h2'].indexOf(style) !== -1
      ? 'mt-12 mb-6'
      : 'mt-6 mb-2'} w-fit rounded-sm focusOutline-sm"
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    {#if style === 'h1'}
      <h1 class="{baseHeadingClasses} text-5xl">
        <slot />
      </h1>
    {:else if style === 'h2'}
      <h2 class="{baseHeadingClasses} text-4xl">
        <slot />
      </h2>
    {:else if style === 'h3'}
      <h3 class="{baseHeadingClasses} text-4xl">
        <slot />
      </h3>
    {:else if style === 'h4'}
      <h4 class="{baseHeadingClasses} text-3xl">
        <slot />
      </h4>
    {:else}
      <h5 class="{baseHeadingClasses} text-xl">
        <slot />
      </h5>
    {/if}
  </a>
</Hoverable>
