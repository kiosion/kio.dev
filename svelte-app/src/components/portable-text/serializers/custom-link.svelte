<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;

  $: ({ value } = portableText);
  $: ({ href } = value);
  $: ({ plainTextContent } = portableText);

  let isExt = true;

  const svg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 18 6'>
      <path d='M 0,0 h 100' fill='#34d399' stroke='#34d399' stroke-width='2.8' />
    </svg>
  `);

  $: href && (isExt = href.indexOf('http') >= 0);
</script>

<Hoverable>
  <a
    href={href ? href : '#'}
    target={isExt ? '_blank' : undefined}
    class="z-10"
    style={`background-image:url("data:image/svg+xml,${svg}");`}
    tabindex="0"
  >
    {plainTextContent}
  </a>
</Hoverable>

<style lang="scss">
  a {
    background-position-y: 105%;
    background-repeat: repeat-x;
    background-size: 12px 6px;
    padding-bottom: 4px;
    transition: background-position-y 120ms ease-in;

    &:hover,
    &:active {
      background-position-y: center;
    }
  }
</style>
