<script lang="ts">
  import Icon from '$components/icon.svelte';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value, indexInParent } = portableText);
  $: ({ style } = value);
</script>

<a
  class="focusOutline-sm {style}"
  class:first={indexInParent === 0}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
>
  <Icon
    icon="link"
    class="link-icon absolute -left-8 top-1/2 -translate-y-1/2"
    aria-hidden="true"
  />
  <svelte:element
    this={style}
    class="inline font-display font-bold text-black dark:text-white"
  >
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  :global(.link-icon) {
    @apply hidden;

    :hover &,
    :focus-visible &,
    :focus-within & {
      @apply block;
    }
  }

  a {
    @apply relative block w-full rounded-sm font-extrabold;

    &.h1 {
      @apply mb-6 mt-14;
    }
    &.h2 {
      @apply mb-6 mt-12;
    }
    &.h3 {
      @apply mb-5 mt-10;
    }
    &.h4 {
      @apply mb-4 mt-8;
    }
    &.h5 {
      @apply mb-4 mt-6;
    }
    &.h6 {
      @apply mb-3 mt-5;
    }

    &.h1,
    &.h2,
    &.h3,
    &.h4,
    &.h5,
    &.h6 {
      &.first {
        @apply mt-5;
      }
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
  }
</style>
