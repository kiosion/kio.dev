<script lang="ts">
  import BulletPoint from '$components/bullet-point.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { AuthorTimelineItem } from '$types';

  export let title: string | undefined, body: AuthorTimelineItem['body'], date: string;
</script>

<div class="item">
  <div>
    <BulletPoint />
    <span>
      <h2>{title}</h2>
      <p>{date}</p>
    </span>
  </div>

  {#if body}
    <div class="body">
      <PortableText text={body} />
    </div>
  {/if}
</div>

<style lang="scss">
  .item {
    @apply flex flex-col items-start justify-start;
  }

  h2 {
    @apply text-lg font-bold text-dark transition-colors;
  }

  div {
    @apply flex w-full flex-row items-center justify-start gap-x-2;

    span {
      @apply flex w-full flex-row items-center justify-between text-base;
    }

    p {
      @apply text-right font-mono text-sm text-dark/80 transition-colors;
    }
  }

  .body {
    @apply -mt-1 pl-8 text-base;
  }

  :global(.dark) {
    h2 {
      @apply text-white;
    }

    div {
      p {
        @apply text-light/80;
      }
    }
  }
</style>
