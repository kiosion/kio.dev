<script lang="ts">
  import type { ListComponentProps } from '@portabletext/svelte';

  export let portableText: ListComponentProps;

  $: ({ value: _value } = portableText);
</script>

<ol class="pt-ol my-6 ml-6 list-decimal px-6 leading-8 transition-[color] md:px-10">
  <slot />
</ol>
