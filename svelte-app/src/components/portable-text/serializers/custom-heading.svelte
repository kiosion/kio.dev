<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  let hovered: false;

  $: ({ value } = portableText);
  $: ({ style } = value);
</script>

<Hoverable bind:hovered>
  <a
    class="focusOutline-sm"
    class:large={style && ['h1', 'h2'].indexOf(style) !== -1}
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    {#if hovered}
      <Icon icon="link" classNames="absolute -left-8 top-1/2 -translate-y-1/2" />
    {/if}

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

<style lang="scss">
  a {
    @apply relative mb-2 mt-6 block w-fit rounded-sm font-extrabold;

    &.large {
      @apply mb-6 mt-12;
    }

    h1 {
      @apply inline font-display text-5xl font-bold;
    }
    h2 {
      @apply inline font-display text-4xl font-bold;
    }
    h3 {
      @apply inline font-display text-3xl font-bold;
    }
    h4 {
      @apply inline font-display text-2xl font-bold;
    }
    h5 {
      @apply inline font-display text-xl font-bold;
    }
  }
</style>
