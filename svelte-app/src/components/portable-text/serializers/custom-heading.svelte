<script lang="ts">
  import { page } from '$app/stores';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  let isHighlighted = false,
    highlightedTimeout: ReturnType<typeof setTimeout>;

  const setHighlighted = (val: boolean) => {
    isHighlighted = val;

    clearTimeout(highlightedTimeout);

    val &&
      (highlightedTimeout = setTimeout(() => {
        isHighlighted = false;
      }, 5000));
  };

  $: ({ global, value, indexInParent } = portableText);
  $: ({ style } = value);
  $: $page?.url?.hash === `#${value._key}` ? setHighlighted(true) : setHighlighted(false);
</script>

<a
  class="focus-outline-sm relative block w-full rounded-sm font-extrabold text-neutral-800 decoration-orange-light decoration-2 underline-offset-4 transition-colors dark:text-neutral-0 {style}"
  class:px-6={global.context.documentView}
  class:md:px-10={global.context.documentView}
  class:!mt-8={indexInParent === 0}
  class:underline={isHighlighted}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
>
  <svelte:element this={style} class="-ml-1.5 inline font-display font-bold">
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  @import '@styles/colors';
  @import '@styles/mixins';

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
    @apply text-4xl leading-[1.1];
  }
  h2 {
    @apply text-3xl leading-[1.05];
  }
  h3 {
    @apply text-2xl leading-none;
  }
  h4 {
    @apply text-xl leading-none;
  }
  h5 {
    @apply text-lg leading-none;
  }
  h6 {
    @apply text-lg leading-none;
  }

  .highlighted {
    color: mix($neutral-800, $orange-dark);

    @include dark {
      color: mix($neutral-0, $orange-light);
    }
  }
</style>
