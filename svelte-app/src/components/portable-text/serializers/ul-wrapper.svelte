<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ value: _value } = portableText);
</script>

<ul class="pt-ul ml-6 list-disc">
  <slot />
</ul>

<style>
  :global(.pt-ul li) {
    margin-bottom: 0.5rem;
    line-height: 1.4rem;
  }
</style>
