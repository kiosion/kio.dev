<svelte:options runes={true} />
<script lang="ts">
  import type { ListComponentProps } from '@portabletext/svelte';

  // export let portableText: ListComponentProps;
  const { portableText } = $props<{
    portableText: ListComponentProps;
  }>();

  const { value: _value } = $derived(portableText);

  // $: ({ value: _value } = portableText);
</script>

<ol class="pt-ol"><slot /></ol>

<style lang="scss">
  ol {
    @apply my-6 ml-6 list-decimal leading-8 transition-[color];
  }
</style>
