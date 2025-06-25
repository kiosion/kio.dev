<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value: _value } = portableText);
</script>

<span class="relative p-0.5">
  <span class="text-dark relative z-[1] transition-colors">
    <slot />
  </span>
  <span
    class="bg-orange-light/90 absolute top-0 right-0 bottom-0 left-0 z-[0] transition-colors"
  ></span>
</span>
