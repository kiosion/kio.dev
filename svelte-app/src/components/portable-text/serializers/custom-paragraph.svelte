<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ indexInParent, global } = portableText);
</script>

<p
  class="transition-[color]"
  class:my-4={(indexInParent > 0 && global.context.bodySize === 'md') ||
    (!global.context.documentView && global.context.bodySize === 'md')}
  class:my-2={indexInParent > 0 && global.context.bodySize === 'base'}
  class:mt-8={indexInParent === 0 && global.context.documentView}
  class:mb-4={indexInParent === 0 && global.context.documentView}
  class:lg:max-w-[60rem]={global.context.documentView}
>
  <slot />
</p>
