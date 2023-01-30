<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<ol class="ml-6 list-decimal leading-8">
  <slot />
</ol>
