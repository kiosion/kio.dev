<script lang="ts">
  import { t } from '$lib/i18n';
  import Logger from '$lib/logger';

  import ChevronDoubleUpSmall from '$components/icons/chevron-double-up-small.svelte';
  import ChevronUpSmall from '$components/icons/chevron-up-small.svelte';
  import Footnote from '$components/portable-text/footnote.svelte';
  import CodeBlock from '$components/portable-text/serializers/code-block.svelte';
  import CustomCode from '$components/portable-text/serializers/custom-code.svelte';
  import CustomHeading from '$components/portable-text/serializers/custom-heading.svelte';
  import CustomHighlight from '$components/portable-text/serializers/custom-highlight.svelte';
  import CustomLink from '$components/portable-text/serializers/custom-link.svelte';
  import CustomParagraph from '$components/portable-text/serializers/custom-paragraph.svelte';
  import CustomQuote from '$components/portable-text/serializers/custom-quote.svelte';
  import Divider from '$components/portable-text/serializers/divider.svelte';
  import Image from '$components/portable-text/serializers/image.svelte';
  import ListItem from '$components/portable-text/serializers/list-item.svelte';
  import NullMark from '$components/portable-text/serializers/null-mark.svelte';
  import OlWrapper from '$components/portable-text/serializers/ol-wrapper.svelte';
  import UlWrapper from '$components/portable-text/serializers/ul-wrapper.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import { PortableText } from '@portabletext/svelte';

  import type {
    ArbitraryTypedObject,
    PortableTextBlock,
    PortableTextMarkDefinition
  } from '@portabletext/types';
  import type { RouteFetch } from '$types';

  interface FootnoteProps extends PortableTextMarkDefinition {
    _key: string;
    note: PortableTextBlock[];
  }

  export let text: (PortableTextBlock | ArbitraryTypedObject)[],
    plainText = false,
    bodySize: 'base' | 'md' = 'md',
    documentView = false,
    routeFetch: RouteFetch | undefined = undefined;

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

<div
  class={$$props.class ?? ''}
  class:text-base={bodySize === 'base'}
  class:text-md={bodySize === 'md'}
>
  {#if text}
    {#if plainText}
      <PortableText
        value={text}
        components={{
          marks: {
            link: CustomLink,
            code: CustomCode,
            highlight: CustomHighlight,
            notranslate: NullMark
          }
        }}
        context={{
          documentView,
          bodySize
        }}
      ></PortableText>
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
            footnote: Footnote,
            notranslate: NullMark
          },
          block: {
            h1: CustomHeading,
            h2: CustomHeading,
            h3: CustomHeading,
            h4: CustomHeading,
            h5: CustomHeading,
            h6: CustomHeading,
            normal: CustomParagraph,
            blockquote: CustomQuote
          },
          list: {
            bullet: UlWrapper,
            number: OlWrapper
          },
          listItem: {
            bullet: ListItem,
            number: ListItem,
            normal: ListItem
          }
        }}
        context={{
          footnotes,
          routeFetch,
          documentView,
          bodySize
        }}
      ></PortableText>
      {#if footnotes?.length}
        <div class="footnotes mt-8 px-6 transition-[color] md:px-10">
          <h3 class="mb-6 block font-display text-2xl font-bold">
            {$t('Footnotes')}
          </h3>
          <ol class="ml-6 list-decimal leading-8">
            {#each footnotes as note}
              <li class="list-item">
                <span class="inline-flex flex-row items-start break-all">
                  <svelte:self text={note.note} plaintext />
                  <Tooltip text={$t('Go to footnote source')} position="top">
                    <a
                      class="focus-outline-sm group ml-2 rounded-xs px-2 py-1 text-sm transition-colors hover:bg-neutral-light dark:hover:bg-neutral-dark"
                      href={`#src-${note._key}`}
                      id="note-{note._key}"
                      aria-label={$t('Go to footnote source')}
                      on:click={(e) => customScrollTo(e, `src-${note._key}`)}
                      on:keydown={(e) => {
                        if (e.code === 'Space' || e.code === 'Enter') {
                          customScrollTo(e, `src-${note._key}`);
                        }
                      }}
                    >
                      <span class="hidden group-hover:inline group-focus-visible:inline">
                        <ChevronDoubleUpSmall />
                      </span>
                      <span class="inline group-hover:hidden group-focus-visible:hidden">
                        <ChevronUpSmall />
                      </span>
                    </a>
                  </Tooltip>
                </span>
              </li>
            {/each}
          </ol>
        </div>
      {/if}
    {/if}
  {/if}
</div>

<style lang="scss">
  :global(.footnotes .list-item p) {
    margin: {
      top: 0;
      bottom: 0;
    }
  }
</style>
