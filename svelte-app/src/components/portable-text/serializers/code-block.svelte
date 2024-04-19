<script lang="ts">
  import CodeBlock from '$components/code-block.svelte';

  import type { CodeBlockComponentProps } from '$types';

  export let portableText: CodeBlockComponentProps;

  $: ({ value } = portableText);
  $: ({ code, language, filename } = value);
</script>

<CodeBlock content={code} showLineNumbers lang={language} {filename}></CodeBlock>
