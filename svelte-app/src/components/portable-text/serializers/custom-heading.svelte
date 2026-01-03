<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';
  import { page } from '$app/stores';

  export let portableText: BlockComponentProps;

  let isHighlighted = false,
    highlightedTimeout: ReturnType<typeof setTimeout>;

  const setHighlighted = (val: boolean) => {
    isHighlighted = val;

    clearTimeout(highlightedTimeout);

    if (!val) {
      return;
    }

    highlightedTimeout = setTimeout(() => {
      isHighlighted = false;
    }, 5000);
  };

  $: ({ global, value, indexInParent } = portableText);
  $: ({ style } = value);
  $: $page?.url?.hash === `#${value._key}` ? setHighlighted(true) : setHighlighted(false);
</script>

<a
  class="focus-outline-sm decoration-orange-light dark:text-neutral-0 relative block w-full rounded-sm text-neutral-800 decoration-2 underline-offset-4 transition-colors {style}"
  class:!mt-8={indexInParent === 0}
  class:underline={isHighlighted}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
>
  <svelte:element this={style} class="font-display -ml-1.5 inline font-semibold">
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  @use '@styles/colors';
  @use '@styles/mixins';

  @reference 'tailwindcss';

  .h1 {
    @apply mt-10 mb-6;
  }
  .h2 {
    @apply mt-10 mb-6;
  }
  .h3 {
    @apply mt-8 mb-5;
  }
  .h4 {
    @apply mt-8 mb-5;
  }
  .h5 {
    @apply mt-6 mb-4;
  }

  h1 {
    @apply text-3xl leading-[1.1];
  }
  h2 {
    @apply text-2xl leading-[1.05];
  }
  h3 {
    @apply text-xl leading-none;
  }
  h4 {
    @apply text-lg leading-none;
  }
  h5 {
    @apply text-lg leading-none;
  }

  .highlighted {
    color: mix(colors.$neutral-800, colors.$orange-dark);

    @include mixins.dark {
      color: mix(colors.$neutral-0, colors.$orange-light);
    }
  }
</style>
