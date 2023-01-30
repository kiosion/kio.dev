<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { linkTo } from '$i18n';
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  let hovered: boolean;

  $: ({ value } = portableText);
  $: ({ plainTextContent } = portableText);
  $: href = value.href as string;
  // TODO: Eventually use 'external' to show tooltip or not.
  $: _external = !!value.external as boolean;
  $: newtab = !!value.newtab as boolean;
</script>

<Hoverable bind:hovered>
  <a
    href={href ? linkTo(href) : '#'}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : ''}
    class="focusOutline-sm"
    class:active={hovered}
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>

<style lang="scss">
  a {
    @apply rounded-sm from-violet-300 px-[2px] no-underline;

    background-image: linear-gradient(
      to right,
      var(--tw-gradient-from) 0%,
      var(--tw-gradient-from) 100%
    );
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease;

    &.active {
      background-size: calc(100% - 4px) 100%;
    }
  }

  :global(.dark) {
    .active {
      @apply text-stone-800;
    }
  }
</style>
