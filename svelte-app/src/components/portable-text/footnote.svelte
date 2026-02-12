<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';
  import type {
    PortableTextBlock,
    PortableTextMarkDefinition,
  } from '@portabletext/types';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { t } from '$lib/i18n';
  import type { Snippet } from 'svelte';

  interface FootnoteProps extends PortableTextMarkDefinition {
    _key: string;
    note: PortableTextBlock[];
  }

  let {
    portableText,
    children: ptChildren,
  }: {
    portableText: MarkComponentProps<
      FootnoteProps,
      {
        footnotes: FootnoteProps[];
      }
    >;
    children: Snippet;
  } = $props();

  let number = $derived.by(() => {
    const index = portableText.global.context.footnotes.findIndex(
      (note) => note._key === portableText.value._key,
    );
    return index >= 0 ? index + 1 : '?';
  });

  const customScrollTo = (event: Event, id: string) => {
    event.preventDefault();
    const element = document.querySelector(`#${id}`);
    if (element) {
      window.history.pushState(null, '', `#${id}`);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
</script>

<span>
  {@render ptChildren()}&nbsp;
  <Tooltip content={$t('Go to footnote')}>
    {#snippet children({ id: tooltipId })}
      <sup
        ><a
          class="decoration-dark/80 dark:decoration-light/80 underline decoration-dotted underline-offset-4"
          href={`#note-${portableText.value._key}`}
          id="src-{portableText.value._key}"
          aria-label={$t('Go to footnote')}
          aria-describedby={tooltipId}
          onclick={(e) => customScrollTo(e, `note-${portableText.value._key}`)}
          onkeydown={(e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
              customScrollTo(e, `note-${portableText.value._key}`);
            }
          }}>{number}</a
        ></sup>
    {/snippet}
  </Tooltip>
</span>
