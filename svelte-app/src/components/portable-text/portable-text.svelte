<script lang="ts">
  import { PortableText } from '@portabletext/svelte';
  import CustomHeading from './serializers/custom-heading.svelte';
  import CustomLink from './serializers/custom-link.svelte';
  import CodeBlock from './serializers/code-block.svelte';
  import CustomParagraph from './serializers/custom-paragraph.svelte';
  import CustomCode from './serializers/custom-code.svelte';
  import CustomQuote from './serializers/custom-quote.svelte';
  import CustomHighlight from './serializers/custom-highlight.svelte';
  import Divider from './serializers/divider.svelte';

  import type { InputValue } from '@portabletext/svelte/ptTypes';

  export let text: InputValue;
</script>

{#if text}
  <PortableText
    value={text}
    components={{
      types: {
        code: CodeBlock,
        divider: Divider
      },
      marks: {
        link: CustomLink,
        code: CustomCode,
        highlight: CustomHighlight
      },
      block: {
        h1: CustomHeading,
        h2: CustomHeading,
        h3: CustomHeading,
        h4: CustomHeading,
        h5: CustomHeading,
        normal: CustomParagraph,
        blockquote: CustomQuote
      },
      list: {},
      listItem: {}
    }}
  />
{/if}
