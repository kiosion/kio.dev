<script lang="ts">
  import { t } from '$lib/i18n';

  import Tooltip from '$components/tooltips/tooltip.svelte';

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
  <slot />&nbsp;
  <Tooltip text={$t('Go to footnote')}>
    <sup
      ><a
        href={`#note-${portableText.value._key}`}
        id="src-{portableText.value._key}"
        aria-label={$t('Go to footnote')}
        on:click={(e) => customScrollTo(e, `note-${portableText.value._key}`)}
        on:keydown={(e) => {
          if (e.code === 'Space' || e.code === 'Enter') {
            customScrollTo(e, `note-${portableText.value._key}`);
          }
        }}>{number}</a
      ></sup
    >
  </Tooltip>
</span>

<style lang="scss">
  span {
    &,
    sup > a {
      @apply underline decoration-dark/80 decoration-dotted underline-offset-4;
    }
  }

  :global(.dark) {
    span {
      &,
      sup > a {
        @apply decoration-light/80;
      }
    }
  }
</style>
