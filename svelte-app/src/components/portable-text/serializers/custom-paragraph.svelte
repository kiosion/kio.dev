<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ global } = portableText);
</script>

<p
  class="mt-4 transition-[color]"
  class:mt-2={global.context.bodySize === 'base'}
  class:mt-4={global.context.bodySize !== 'base'}
  class:first:mt-0={!global.context.documentView}
  class:first:mt-8={global.context.documentView}
  class:lg:max-w-[60rem]={global.context.documentView}>
  <slot />
</p>

<style lang="scss">
  p:empty::before {
    // zero-width space to prevent collapsing newlines.
    content: '\200B';
  }
</style>
