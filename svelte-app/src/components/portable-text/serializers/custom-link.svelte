<svelte:options runes={true} />
<script lang="ts">
  import Link from '$components/link.svelte';

  import type { MarkComponentProps } from '@portabletext/svelte';

  // export let portableText: MarkComponentProps;
  const { portableText } = $props<{
    portableText: MarkComponentProps;
  }>();

  const { value, plainTextContent } = $derived(portableText);

  // $: ({ value, plainTextContent } = portableText);
</script>

<Link href={value.href} newtab={!!value.newtab}>{plainTextContent}</Link>
