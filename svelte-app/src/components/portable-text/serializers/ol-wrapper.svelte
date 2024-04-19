<script lang="ts">
  import type { ListComponentProps } from '@portabletext/svelte';

  export let portableText: ListComponentProps;

  $: ({ global } = portableText);
</script>

<ol
  class="pt-ol ml-6 list-decimal leading-8 transition-[color]"
  class:px-6={global.context.documentView}
  class:my-6={global.context.bodySize === 'md'}
  class:my-4={global.context.bodySize === 'base'}
  class:md:px-10={global.context.documentView}
  class:lg:max-w-[60rem]={global.context.documentView}
>
  <slot />
</ol>
