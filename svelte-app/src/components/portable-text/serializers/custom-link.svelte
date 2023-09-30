<script lang="ts">
  import Link from '$components/link.svelte';

  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value, plainTextContent } = portableText);
</script>

<Link href={value.href} newtab={!!value.newtab}>{plainTextContent}</Link>
