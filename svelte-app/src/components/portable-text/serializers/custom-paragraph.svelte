<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<p><slot /></p>

<style lang="scss">
  p {
    @apply my-4 leading-[1.6] transition-[color];
  }
</style>
