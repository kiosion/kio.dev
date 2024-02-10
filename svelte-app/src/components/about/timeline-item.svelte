<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';

  import Icon from '$components/icon.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { WorkTimelineItem } from '$types';

  export let title: WorkTimelineItem['subtitle'],
    body: WorkTimelineItem['body'],
    range: WorkTimelineItem['range'],
    first = false,
    last = false;
</script>

<div class:last class="item">
  <Icon
    name={last ? 'ArrowRight' : 'CornerUpRight'}
    class="timeline-item-icon"
    style={`transform: translate(-${last ? '3' : '1'}px, 2px);`}
  />
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
  $arrowTopGap: 10px;
  $lineTopGap: 16px;
  $arrowWidth: 6px;
  $lineWidth: 2px;

  :global(.timeline-item-icon) {
    @apply text-dark/40 transition-colors;

    :global(.dark) & {
      @apply text-white/30;
    }
  }

  .item {
    @apply relative flex flex-row items-start justify-start gap-x-6 pb-5 pl-3;

    &.last {
      @apply pb-0;
    }
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
      @apply absolute bg-dark/20 transition-colors;

      $arrowSpaceFromTop: $arrowTopGap + $arrowWidth;

      content: '';
      top: #{$arrowSpaceFromTop + $lineTopGap};
      left: #{$arrowWidth * 2 + $lineWidth};
      height: calc(100% - #{($arrowSpaceFromTop + $lineTopGap) + calc($lineTopGap / 2)});
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
