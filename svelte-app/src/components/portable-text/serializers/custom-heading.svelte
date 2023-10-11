<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { afterNavigate } from '$app/navigation';
  import Logger from '$lib/logger';
  import { visibleHeadings } from '$lib/summary';

  import Icon from '$components/icon.svelte';

  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  let observer: IntersectionObserver, element: HTMLAnchorElement;

  const scrollContainer = (getContext('getScrollContainer') as () => HTMLDivElement)();

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        const key = value._key;
        if (!key?.length) {
          Logger.warn("Heading is missing '_key' property");
          return;
        }
        visibleHeadings.update((state) => {
          if (entries[0]?.isIntersecting) {
            return state.add(key);
          } else {
            state.delete(key);
            return state;
          }
        });
        get(visibleHeadings);
      },
      {
        rootMargin: '-250px 0px 0px 0px',
        root: scrollContainer,
        threshold: [1]
      }
    );
    observer.observe(element);
  });

  afterNavigate(() => {
    observer?.disconnect();
  });

  $: ({ value, indexInParent } = portableText);
  $: ({ style } = value);
</script>

<a
  class={style}
  class:first={indexInParent === 0}
  id={`heading-${value._key}`}
  href={`#${value._key}`}
  bind:this={element}
>
  <Icon icon="link" class="link-icon" aria-hidden="true" />
  <svelte:element this={style}>
    <slot />
  </svelte:element>
</a>

<style lang="scss">
  @import '@styles/mixins';

  :global(.link-icon) {
    @apply absolute -left-8 top-1/2 hidden -translate-y-1/2;

    :hover &,
    :focus-visible &,
    :focus-within & {
      @apply block;
    }
  }

  a {
    @apply relative block w-full rounded-sm font-extrabold;

    @include focus-state(sm);

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @apply inline font-display font-bold text-black transition-[color];
    }

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

  :global(.dark) {
    a {
      @include focus-state(sm, dark);

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        @apply text-white;
      }
    }
  }
</style>
