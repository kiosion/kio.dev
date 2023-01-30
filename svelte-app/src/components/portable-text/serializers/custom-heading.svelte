<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value } = portableText);
  $: ({ style } = value);
</script>

<Hoverable>
  <a
    class="focusOutline-sm"
    class:large={style && ['h1', 'h2'].indexOf(style) !== -1}
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    {#if style === 'h1'}
      <h1>
        <slot />
      </h1>
    {:else if style === 'h2'}
      <h2>
        <slot />
      </h2>
    {:else if style === 'h3'}
      <h3>
        <slot />
      </h3>
    {:else if style === 'h4'}
      <h4>
        <slot />
      </h4>
    {:else}
      <h5>
        <slot />
      </h5>
    {/if}
  </a>
</Hoverable>

<style lang="postcss">
  a {
    @apply block w-fit rounded-sm mt-6 mb-2 font-extrabold;

    &.large {
      @apply mt-12 mb-6;
    }

    h1 {
      @apply inline font-display font-bold text-5xl;
    }
    h2 {
      @apply inline font-display font-bold text-4xl;
    }
    h3 {
      @apply inline font-display font-bold text-3xl;
    }
    h4 {
      @apply inline font-display font-bold text-2xl;
    }
    h5 {
      @apply inline font-display font-bold text-xl;
    }
  }
</style>
