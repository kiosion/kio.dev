<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  let href: string | undefined;
  let hovered: boolean;

  $: ({ value } = portableText);
  $: ({ plainTextContent } = portableText);
  $: href = value.href as string;

  let isExt = true;

  $: href && (isExt = (href as string).indexOf('http') >= 0);
</script>

<Hoverable bind:hovered>
  <a
    href={href ? href : '#'}
    target={isExt ? '_blank' : undefined}
    class="decoration-emerald-400 dark:decoration-emerald-300 underline underline-offset-auto {hovered
      ? 'decoration-4'
      : 'decoration-2'} rounded-sm focusOutline-sm"
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>
