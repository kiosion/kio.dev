<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';
  import Link from '$components/link.svelte';

  export let portableText: MarkComponentProps;

  $: ({ value, plainTextContent } = portableText);
</script>

<Link href={value.href} newtab={!!value.newtab}>{plainTextContent}</Link>
