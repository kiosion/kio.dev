<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value } = portableText);
  // $: ({ color } = value);
</script>

<span class="relative px-0.5">
  <slot />
  <span
    class="absolute w-full h-full left-0 bottom-0 bg-emerald-400 rounded-sm opacity-90"
  />
</span>

<style lang="scss">
  span {
    span {
      z-index: -1;
    }
  }
</style>
