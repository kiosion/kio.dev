<script lang="ts">
  import { linkTo } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';

  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  let hovered: boolean;

  $: ({ value } = portableText);
  $: ({ plainTextContent } = portableText);
  $: href = value.href as string;
  $: newtab = !!value.newtab as boolean;
</script>

<Hoverable bind:hovered>
  <a
    href={href ? $linkTo(href) : '#'}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : ''}
    class="focusOutline-sm rounded-sm from-accent-light text-dark/90 underline decoration-accent-light underline-offset-[2px] dark:text-light dark:decoration-accent-dark {hovered
      ? 'decoration-[3px]'
      : 'decoration-2'}"
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>
