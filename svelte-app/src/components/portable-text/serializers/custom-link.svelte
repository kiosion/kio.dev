<script lang="ts">
  import { linkTo } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';

  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  let hovered: boolean;

  $: ({ value } = portableText);
  $: ({ plainTextContent } = portableText);
  $: href = value.href as string;
  $: newtab = !!value.newtab as boolean;
</script>

<Hoverable bind:hovered>
  <a
    href={href ? $linkTo(href) : '#'}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : ''}
    class="focusOutline-sm rounded-sm from-accent-light px-[2px] text-dark/90 no-underline dark:from-accent-dark dark:text-light"
    class:active={hovered}
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>

<style lang="scss">
  a {
    background-image: linear-gradient(
      to right,
      var(--tw-gradient-from) 0%,
      var(--tw-gradient-from) 100%
    );
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease !important;

    &.active {
      @apply text-light;

      background-size: calc(100% - 4px) 100%;
    }
  }

  :global(.dark) {
    a.active {
      @apply text-dark;
    }
  }
</style>
