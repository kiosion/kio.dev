<script lang="ts">
  import type { ListComponentProps } from '@portabletext/svelte';

  export let portableText: ListComponentProps;

  $: ({ value: _value } = portableText);
</script>

<ul class="pt-ul"><slot /></ul>

<style lang="scss">
  ul {
    @apply my-6 ml-6 list-disc transition-[color];
  }
</style>
