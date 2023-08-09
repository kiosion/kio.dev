<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';
  import type {
    PortableTextBlock,
    PortableTextMarkDefinition
  } from '@portabletext/types';

  interface FootnoteProps extends PortableTextMarkDefinition {
    _key: string;
    note: PortableTextBlock[];
  }

  export let portableText: MarkComponentProps<
    FootnoteProps,
    {
      footnotes: FootnoteProps[];
    }
  >;

  const customScrollTo = (event: Event, id: string) => {
    event.preventDefault();
    const element = document.querySelector(`#${id}`);
    if (element) {
      window.history.pushState(null, '', `#${id}`);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  $: number =
    portableText.global.context.footnotes.findIndex(
      (note) => note._key === portableText.value._key
    ) + 1;
</script>

<span>
  <slot />&nbsp;<sup
    ><a
      class="decoration-gray-400 dark:decoration-gray-500 underline decoration-dotted underline-offset-4"
      href={`#note-${portableText.value._key}`}
      id="src-{portableText.value._key}"
      aria-label="Go to footnote"
      on:click={(e) => customScrollTo(e, `note-${portableText.value._key}`)}
      on:keydown={(e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          customScrollTo(e, `note-${portableText.value._key}`);
        }
      }}>{number}</a
    ></sup
  >
</span>
