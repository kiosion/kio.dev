<script lang="ts">
  import Divider from '@/components/divider.svelte';
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value } = portableText);
</script>

<Divider />
