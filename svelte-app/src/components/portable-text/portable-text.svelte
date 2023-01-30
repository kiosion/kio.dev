<script lang="ts">
  import { PortableText } from '@portabletext/svelte';
  import { t } from '$i18n';
  import CustomHeading from './serializers/custom-heading.svelte';
  import CustomLink from './serializers/custom-link.svelte';
  import CodeBlock from './serializers/code-block.svelte';
  import CustomParagraph from './serializers/custom-paragraph.svelte';
  import CustomCode from './serializers/custom-code.svelte';
  import CustomQuote from './serializers/custom-quote.svelte';
  import CustomHighlight from './serializers/custom-highlight.svelte';
  import Divider from './serializers/divider.svelte';
  import OlWrapper from './serializers/ol-wrapper.svelte';
  import UlWrapper from './serializers/ul-wrapper.svelte';
  import OlItem from './serializers/ol-item.svelte';
  import UlItem from './serializers/ul-item.svelte';
  import Image from './serializers/image.svelte';
  import Footnote from './footnote.svelte';
  import Icon from '$components/icon.svelte';
  import type {
    ArbitraryTypedObject,
    PortableTextBlock,
    PortableTextMarkDefinition
  } from '@portabletext/types';
  import Logger from '$lib/logger';

  interface FootnoteProps extends PortableTextMarkDefinition {
    _key: string;
    note: PortableTextBlock[];
  }

  export let text: (PortableTextBlock | ArbitraryTypedObject)[],
    plainText = false;

  const customScrollTo = (event: Event, id: string) => {
    event.preventDefault();
    const element = document.querySelector(`#${id}`);
    if (element) {
      window.history.pushState(null, '', `#${id}`);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  $: footnotes = ((text: (PortableTextBlock | ArbitraryTypedObject)[]) => {
    if (!text || typeof text === 'string') {
      return [] as FootnoteProps[];
    }
    try {
      return text?.reduce((notes, currentBlock): FootnoteProps[] => {
        if (currentBlock._type !== 'block' || !currentBlock.markDefs?.length) {
          return notes;
        }
        return [
          ...notes,
          ...currentBlock.markDefs.filter(
            (def: PortableTextMarkDefinition) => def._type === 'footnote'
          )
        ];
      }, [] as FootnoteProps[]);
    } catch (e) {
      Logger.error('Error parsing footnotes', undefined, e);
      return [] as FootnoteProps[];
    }
  })(text);
</script>

{#if text}
  {#if plainText}
    <PortableText
      value={text}
      components={{
        marks: {
          link: CustomLink,
          code: CustomCode,
          highlight: CustomHighlight
        }
      }}
    />
  {:else}
    <PortableText
      value={text}
      components={{
        types: {
          code: CodeBlock,
          divider: Divider,
          image: Image
        },
        marks: {
          link: CustomLink,
          code: CustomCode,
          highlight: CustomHighlight,
          footnote: Footnote
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
        list: {
          bullet: UlWrapper,
          number: OlWrapper
        },
        listItem: {
          bullet: UlItem,
          number: OlItem,
          normal: UlItem
        }
      }}
      context={{
        footnotes
      }}
    />
    {#if footnotes?.length}
      <div class="footnotes mt-8">
        <h3 class="mb-6 block font-display text-2xl font-bold">
          {t('Footnotes')}
        </h3>
        <ol class="ml-6 list-decimal leading-8">
          {#each footnotes as note}
            <li class="list-item">
              <span class="flex flex-row flex-wrap items-center">
                <!-- Allow recursion with PT styles in footnotes -->
                <svelte:self text={note.note} plaintext />
                <a
                  class="ml-2 mb-0.5 inline"
                  id={`note-${note._key}`}
                  href={`#src-${note._key}`}
                  aria-label={t('Go to footnote source')}
                  on:click={(e) => customScrollTo(e, `src-${note._key}`)}
                  on:keydown={(e) => {
                    if (e.code === 'Space' || e.code === 'Enter') {
                      customScrollTo(e, `src-${note._key}`);
                    }
                  }}><Icon icon="arrow-bar-up" width={18} inline /></a
                >
              </span>
            </li>
          {/each}
        </ol>
      </div>
    {/if}
  {/if}
{/if}

<style lang="scss">
  :global(.footnotes .list-item p) {
    margin: {
      top: 0;
      bottom: 0;
    }
  }
</style>
