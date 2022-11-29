<script lang="ts">
  import type { CodeBlockComponentProps } from '$types';
  import CodeBlock from '$components/code-block.svelte';

  export let portableText: CodeBlockComponentProps;

  $: ({ value } = portableText);
  $: ({ code } = value);
</script>

<CodeBlock content={code} showClipboard={true} />
