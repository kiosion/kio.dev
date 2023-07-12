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

    h1,
    h2,
    h3,
    h4,
    h5 {
      @apply inline font-display font-bold text-black dark:text-white;
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
