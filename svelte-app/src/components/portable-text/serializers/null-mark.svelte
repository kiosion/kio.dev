<svelte:options runes={true} />
<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  // export let portableText: MarkComponentProps;
  const { portableText } = $props<{
    portableText: MarkComponentProps;
  }>();

  const { value: _value } = $derived(portableText);

  // $: ({ value: _value } = portableText);
</script>

<slot />
