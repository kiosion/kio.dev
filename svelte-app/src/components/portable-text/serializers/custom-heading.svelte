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

    <svelte:element
      this={style}
      class="inline font-display font-bold text-black dark:text-white"
    >
      <slot />
    </svelte:element>
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply relative mb-2 mt-6 block w-fit rounded-sm font-extrabold;

    &.large {
      @apply mb-6 mt-12;
    }

    h1 {
      @apply text-5xl;
    }
    h2 {
      @apply text-4xl;
    }
    h3 {
      @apply text-3xl;
    }
    h4 {
      @apply text-2xl;
    }
    h5 {
      @apply text-xl;
    }
  }
</style>
