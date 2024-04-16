<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ global, value, indexInParent } = portableText);
  $: ({ style } = value);
</script>

<a
  class="focus-outline-sm relative block w-full rounded-sm font-extrabold {style}"
  class:px-6={global.context.documentView}
  class:md:px-10={global.context.documentView}
  class:!mt-8={indexInParent === 0}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
>
  <svelte:element
    this={style}
    class="-ml-1.5 inline font-display font-bold text-black transition-[color] dark:text-light"
  >
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  .h1 {
    @apply mb-6 mt-10;
  }
  .h2 {
    @apply mb-6 mt-10;
  }
  .h3 {
    @apply mb-5 mt-8;
  }
  .h4 {
    @apply mb-5 mt-8;
  }
  .h5 {
    @apply mb-4 mt-6;
  }
  .h6 {
    @apply mb-4 mt-6;
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
