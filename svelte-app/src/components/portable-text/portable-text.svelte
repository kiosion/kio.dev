<script lang="ts">
  import { onMount } from 'svelte';

  import { parseEmoji } from '$helpers/emoji';
  import { t } from '$i18n';
  import Logger from '$lib/logger';

  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import { PortableText } from '@portabletext/svelte';

  import Footnote from './footnote.svelte';
  import CodeBlock from './serializers/code-block.svelte';
  import CustomCode from './serializers/custom-code.svelte';
  import CustomHeading from './serializers/custom-heading.svelte';
  import CustomHighlight from './serializers/custom-highlight.svelte';
  import CustomLink from './serializers/custom-link.svelte';
  import CustomParagraph from './serializers/custom-paragraph.svelte';
  import CustomQuote from './serializers/custom-quote.svelte';
  import Divider from './serializers/divider.svelte';
  import Image from './serializers/image.svelte';
  import ListItem from './serializers/list-item.svelte';
  import NullMark from './serializers/null-mark.svelte';
  import OlWrapper from './serializers/ol-wrapper.svelte';
  import UlWrapper from './serializers/ul-wrapper.svelte';

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
    routeFetch: RouteFetch | undefined = undefined;

  let ptContainer: HTMLElement;

  onMount(() => {
    parseEmoji(ptContainer);
  });

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

<div bind:this={ptContainer} class={$$props.class ?? ''}>
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
          routeFetch
        }}
      />
      {#if footnotes?.length}
        <div class="footnotes mt-8 transition-[color]">
          <h3 class="mb-6 block text-2xl font-bold">
            {$t('Footnotes')}
          </h3>
          <ol class="ml-6 list-decimal leading-8">
            {#each footnotes as note}
              <li class="list-item">
                <span class="flex flex-row flex-wrap items-center break-all">
                  <svelte:self text={note.note} plaintext />
                  <Tooltip text={$t('Go to footnote source')} delay={200}>
                    <a
                      class="ml-2"
                      href={`#src-${note._key}`}
                      id="note-{note._key}"
                      aria-label="Go to footnote source"
                      on:click={(e) => customScrollTo(e, `src-${note._key}`)}
                      on:keydown={(e) => {
                        if (e.code === 'Space' || e.code === 'Enter') {
                          customScrollTo(e, `src-${note._key}`);
                        }
                      }}><Icon icon="arrow-bar-up" width={18} inline /></a
                    >
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
