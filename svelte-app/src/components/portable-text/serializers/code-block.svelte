<script lang="ts">
  import type { BlockComponentProps } from '@portabletext/svelte';
  import CodeBlock from '@/components/code-block.svelte';

  export let portableText: BlockComponentProps<{
    value: {
      _key: string;
      _type: string;
      code: string;
    };
  }>;

  $: ({ value } = portableText);
  $: ({ code } = value);
</script>

<CodeBlock content={code} showClipboard={true} />
