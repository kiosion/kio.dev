<svelte:options runes={true} />
<script lang="ts">
  import CodeBlock from '$components/code-block.svelte';

  import type { CodeBlockComponentProps } from '$types';

  // export let portableText: CodeBlockComponentProps;
  const { portableText } = $props<{
    portableText: CodeBlockComponentProps;
  }>();

  const { value } = $derived(portableText);
  const { code, language, filename } = $derived(value);

  // $: ({ value } = portableText);
  // $: ({ code, language, filename } = value);
</script>

<CodeBlock content={code} showLineNumbers lang={language} {filename} />
