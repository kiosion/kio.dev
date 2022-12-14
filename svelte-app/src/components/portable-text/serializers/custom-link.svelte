<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  let href: string | undefined;
  let hovered: boolean;

  $: ({ value } = portableText);
  $: ({ plainTextContent } = portableText);
  $: href = value.href as string;

  let isExt = true;

  $: href && (isExt = (href as string).indexOf('http') >= 0);
</script>

<Hoverable bind:hovered>
  <a
    href={href ? href : '#'}
    target={isExt ? '_blank' : undefined}
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
    // background-position: 0 1rem;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease;
    &.active {
      background-size: calc(100% - 4px) 100%;
    }
    &-dark {
      // 6ee7b7, else 34d399
    }
  }
</style>
