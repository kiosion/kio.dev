<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value, indexInParent } = portableText);
  $: ({ style } = value);
</script>

<Hoverable let:hovered>
  <a
    class="focus-outline-sm relative block w-full rounded-sm font-extrabold {style}"
    class:!mt-8={indexInParent === 0}
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    <span
      class="font-display pointer-events-none absolute -left-4 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none text-xl font-bold text-accent-light dark:text-accent-dark md:block"
      class:opacity-20={!hovered}
      class:opacity-80={hovered}
      aria-hidden="true"
    >
      #
    </span>
    <svelte:element
      this={style}
      class="font-display inline font-bold text-black transition-[color] dark:text-light"
    >
      <slot />
    </svelte:element>
  </a>
</Hoverable>

<style lang="scss">
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
    @apply text-4xl;
  }
  h2 {
    @apply text-3xl;
  }
  h3 {
    @apply text-2xl;
  }
  h4 {
    @apply text-xl;
  }
  h5 {
    @apply text-lg;
  }
  h6 {
    @apply text-lg;
  }
</style>
