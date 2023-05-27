<script lang="ts">
  import CodeBlock from '$components/code-block.svelte';

  import type { CodeBlockComponentProps } from '$types';

  export let portableText: CodeBlockComponentProps;

  $: ({ value } = portableText);
  $: ({ code, language } = value);
</script>

<CodeBlock content={code} showClipboard={true} lang={language} />
