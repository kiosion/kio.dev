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
  @import '@styles/mixins';

  $bulletTopMargin: 13px;
  $bulletSize: 6px;
  $lineWidth: 2px;
  $lineGap: 14px;

  .item {
    @apply relative flex flex-row items-start justify-start gap-x-6 pb-5 pl-3;

    &.last {
      @apply pb-0;
    }
  }

  .bullet {
    @apply block flex-shrink-0 rounded-full bg-accent-light/80;

    margin-top: $bulletTopMargin;
    width: $bulletSize;
    height: $bulletSize;

    @include dark {
      @apply bg-accent-dark/80;
    }
  }

  h3 {
    @apply py-1 text-base font-bold text-dark transition-colors;

    @include dark {
      @apply text-white;
    }
  }

  .content {
    .last & {
      &:before {
        @apply hidden;
      }
    }

    &:before {
      @apply absolute bg-dark/20;

      $baseSpaceFromTop: $bulletTopMargin + $bulletSize;

      content: '';
      top: #{$bulletTopMargin + $bulletSize + $lineGap};
      bottom: #{0px + $lineGap - $bulletTopMargin};
      left: #{$bulletSize * 2 + $lineWidth};
      width: $lineWidth;

      @include dark {
        @apply bg-white/20;
      }
    }

    p {
      @apply font-mono text-sm text-dark/80 transition-colors;

      @include dark {
        @apply text-light/80;
      }
    }

    .body {
      @apply -mb-4;
    }
  }
</style>
