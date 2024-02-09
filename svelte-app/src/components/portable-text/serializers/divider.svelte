<script lang="ts">
  import Divider from '$components/divider.svelte';

  import type { CustomBlockComponentProps } from '@portabletext/svelte';

  export let portableText: CustomBlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<Divider />
