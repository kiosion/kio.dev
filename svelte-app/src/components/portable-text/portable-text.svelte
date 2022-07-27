<script lang="ts">
  import { PortableText } from '@portabletext/svelte';
  // import Blockquote from "./serializers/blockquote.svelte";
  import CustomHeading from './serializers/custom-heading.svelte';
  // import CustomParagraph from "./serializers/custom-paragraph.svelte";
  import CustomLink from './serializers/custom-link.svelte';

  export let text: [any];
</script>

{#if text}
  <PortableText
    value={text}
    components={{
      types: {},
      marks: {
        customLink: CustomLink
      },
      block: {
        h1: CustomHeading,
        h2: CustomHeading,
        h3: CustomHeading
      },
      list: {},
      listItem: {}
    }}
  />
{/if}
