<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value: _value } = portableText);
</script>

<span class="relative p-0.5">
  <span class="relative z-[1] text-dark transition-colors">
    <slot />
  </span>
  <span
    class="absolute bottom-0 left-0 right-0 top-0 z-[0] bg-orange-light/90 transition-colors"
  ></span>
</span>
