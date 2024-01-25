<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';

  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { WorkTimelineItem } from '$types';

  export let title: WorkTimelineItem['subtitle'],
    body: WorkTimelineItem['body'],
    range: WorkTimelineItem['range'],
    last = false;
</script>

<div class:last class="item">
  <span class="bullet" />
  <div class="content">
    <h3>{title}</h3>
    <p>
      {$displayRange(range.start, range.end)} &bull; {$displayMonthDuration(
        range.start,
        range.end
      )}
    </p>
    {#if body}
      <div class="body">
        <PortableText text={body} />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  $bulletTopGap: 12px;
  $lineTopGap: 16px;
  $bulletWidth: 6px;
  $lineWidth: 2px;

  .item {
    @apply relative flex flex-row items-start justify-start gap-x-6 pb-5 pl-3;

    &.last {
      @apply pb-0;
    }
  }

  .bullet {
    @apply block flex-shrink-0 rounded-full bg-dark/40;

    margin-top: $bulletTopGap;
    width: $bulletWidth;
    height: $bulletWidth;
  }

  h3 {
    @apply text-lg font-bold text-dark transition-colors;
  }

  .content {
    .last & {
      &:before {
        @apply hidden;
      }
    }

    &:before {
      @apply absolute bg-dark/20;

      $bulletSpaceFromTop: $bulletTopGap + $bulletWidth;

      content: '';
      top: #{$bulletSpaceFromTop + $lineTopGap};
      left: #{$bulletWidth * 2 + $lineWidth};
      height: calc(100% - #{($bulletSpaceFromTop + $lineTopGap) + calc($lineTopGap / 2)});
      width: $lineWidth;
    }

    p {
      @apply font-mono text-sm text-dark/80 transition-colors;
    }

    .body {
      @apply -mb-4;
    }
  }

  :global(.dark) {
    h3 {
      @apply text-white;
    }

    .bullet {
      @apply bg-white/40;
    }

    .content {
      &:before {
        @apply bg-white/20;
      }

      p {
        @apply text-light/80;
      }
    }
  }
</style>
