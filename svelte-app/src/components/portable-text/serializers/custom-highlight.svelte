<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value: _value } = portableText);
</script>

<span class="relative p-0.5">
  <span class="relative z-[1] text-light transition-colors dark:text-dark">
    <slot />
  </span>
  <span
    class="absolute bottom-0 left-0 right-0 top-0 z-[0] rounded-[1px] bg-accent-light/90 transition-colors dark:bg-accent-dark/90"
  ></span>
</span>
