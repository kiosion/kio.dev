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

<ul class="pt-ul"><slot /></ul>

<style lang="scss">
  ul {
    @apply my-6 ml-6 list-disc transition-[color];
  }
</style>
