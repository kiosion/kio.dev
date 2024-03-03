<script lang="ts">
  import Icon from '$components/icon.svelte';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value, indexInParent } = portableText);
  $: ({ style } = value);
</script>

<a
  class="focus-outline-sm relative block w-full rounded-sm font-extrabold {style}"
  class:mt-5={indexInParent === 0}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
>
  <Icon name="link" class="link-icon" aria-hidden="true" />
  <svelte:element
    this={style}
    class="inline font-bold text-black transition-[color] dark:text-light"
  >
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  @import '@styles/mixins';

  :global(.link-icon) {
    @apply absolute -left-4 top-1/2 hidden -translate-y-1/2;

    :hover &,
    :focus-visible &,
    :focus-within & {
      @apply block;
    }
  }

  .h1 {
    @apply mb-6 mt-14;
  }
  .h2 {
    @apply mb-6 mt-12;
  }
  .h3 {
    @apply mb-5 mt-10;
  }
  .h4 {
    @apply mb-4 mt-8;
  }
  .h5 {
    @apply mb-4 mt-6;
  }
  .h6 {
    @apply mb-3 mt-5;
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
  h6 {
    @apply text-lg;
  }
</style>
