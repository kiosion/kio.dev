<script lang="ts">
  import type { MarkComponentProps } from '@portabletext/svelte';

  export let portableText: MarkComponentProps;
  export let newWindow = true;

  $: ({ value } = portableText);
  $: ({ href } = value);
  $: ({ plainTextContent } = portableText);

  let hovering = false;

  const svg = btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 8">
      <path d="M-5.5,3.8C-4.2,4.8-2.8,6,0,6s4.2-1.2,5.5-2.2C6.6,2.8,7.6,2,9.7,2s3,0.8,4.2,1.8c1.3,1,2.7,2.2,5.5,2.2  s4.2-1.2,5.5-2.2l-1.4-0.9c-1.1,1-2.1,1.8-4.2,1.8s-3-0.8-4.2-1.8c-1.2-1-2.7-2.2-5.4-2.2c-2.8,0-4.2,1.2-5.5,2.2  C3,3.9,2.1,4.7,0,4.7s-3-0.8-4.2-1.8L-5.5,3.8z" fill='#34d399' stroke='#34d399' stroke-width='1.2'/>
    </svg>
  `);
</script>

<a
  href={href ? href : '#'}
  target={newWindow ? '_blank' : undefined}
  class="z-10 {hovering ? ' is-active' : ''}"
  style="background-image: url('data:image/svg+xml;base64,{svg}');"
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}>{plainTextContent}</a
>

<style lang="scss">
  @keyframes move {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: 498px;
    }
  }

  a {
    background-position-y: bottom;
    background-repeat: repeat-x;
    background-size: 12px 5px;
    animation: move 15s linear infinite;
    animation-play-state: paused;
    text-decoration: none;
    padding-bottom: 5px;

    &.is-active {
      animation-play-state: running;
    }
  }
</style>
