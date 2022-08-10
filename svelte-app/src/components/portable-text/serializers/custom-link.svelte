<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;
  export let newWindow = true;

  $: ({ value } = portableText);
  $: ({ href } = value);

  let hovering = false;
</script>

<div class="relative inline-block">
  <a
    href={href ? href : '#'}
    target={newWindow ? '_blank' : undefined}
    class="z-10 {hovering ? ' is-active' : ''}"
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}><slot /></a
  >
  <span class="absolute w-full bg-emerald-300 rounded left-0" />
</div>

<style lang="scss">
  a {
    &.is-active {
      + span {
        bottom: calc(50% - 1px);
      }
    }
  }
  span {
    z-index: 0;
    height: 2px;
    bottom: 1px;
    pointer-events: none;
    opacity: 80%;
    transition: all 150ms ease;
  }
</style>
