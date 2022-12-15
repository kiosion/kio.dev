<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
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
    href={href ? href : '#'}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : ''}
    class="underlined from-emerald-400 dark:from-emerald-300 {hovered
      ? 'active dark:text-slate-800'
      : ''} rounded-sm focusOutline-sm px-[2px] -mx[2px]"
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>

<style lang="scss">
  .underlined {
    text-decoration: none;
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
</style>
