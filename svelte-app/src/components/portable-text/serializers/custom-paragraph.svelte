<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';

  export let portableText: BlockComponentProps;

  $: ({ indexInParent, global } = portableText);
</script>

<p
  class="transition-[color]"
  class:px-6={global.context.documentView}
  class:md:px-10={global.context.documentView}
  class:my-4={indexInParent > 0 || !global.context.documentView}
  class:mt-8={indexInParent === 0 && global.context.documentView}
  class:mb-4={indexInParent === 0 && global.context.documentView}
  class:lg:max-w-[60rem]={global.context.documentView}
>
  <slot />
</p>
