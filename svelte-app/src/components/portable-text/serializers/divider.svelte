<script lang="ts">
  import type { CustomBlockComponentProps } from '@portabletext/svelte';
  import Divider from '$components/divider.svelte';

  export let portableText: CustomBlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<Divider></Divider>
