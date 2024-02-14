<svelte:options runes={true} />
<script lang="ts">
  import type { ListItemComponentProps } from '@portabletext/svelte';

  // export let portableText: ListItemComponentProps;
  const { portableText } = $props<{
    portableText: ListItemComponentProps;
  }>();

  const { value: _value } = $derived(portableText);

  // $: ({ value: _value } = portableText);
</script>

<li><slot /></li>
