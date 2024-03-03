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
    class:mt-5={indexInParent === 0}
    id={`heading-${value._key}`}
    href={`#${value._key}`}
  >
    <span
      class="pointer-events-none absolute -left-5 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-accent-light dark:text-accent-dark lg:block"
      class:opacity-40={!hovered}
      class:opacity-100={hovered}
    >
      #
    </span>
    <svelte:element
      this={style}
      class="inline font-bold text-black transition-[color] dark:text-light"
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
