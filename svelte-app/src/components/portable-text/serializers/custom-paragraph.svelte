<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ indexInParent } = portableText);
</script>

<p
  class="leading-[1.6] transition-[color]"
  class:my-4={indexInParent > 0}
  class:mt-8={indexInParent === 0}
  class:mb-4={indexInParent === 0}
>
  <slot />
</p>
