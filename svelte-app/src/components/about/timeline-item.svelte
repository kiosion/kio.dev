<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';

  import PortableText from '$components/portable-text/portable-text.svelte';

  import type { WorkTimelineItem } from '$types';

  export let title: WorkTimelineItem['subtitle'],
    body: WorkTimelineItem['body'],
    range: WorkTimelineItem['range'],
    last = false;
</script>

<div
  class="relative flex flex-row items-start justify-start gap-x-6 pl-3"
  class:last
  class:pb-0={last}
  class:pb-5={!last}
>
  <span
    class="bullet block flex-shrink-0 rounded-full bg-accent-light/80 dark:bg-accent-dark/80"
  />
  <div class="content">
    <h3
      class="pb-3 pt-1.5 text-base font-bold text-dark transition-colors dark:text-white"
    >
      {title}
    </h3>
    <p class="font-mono text-sm text-dark/80 transition-colors dark:text-light/80">
      {$displayRange(range.start, range.end)} &bull; {$displayMonthDuration(
        range.start,
        range.end
      )}
    </p>
    {#if body}
      <div class="-mb-4 -mt-1">
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

  .bullet {
    margin-top: $bulletTopMargin;
    width: $bulletSize;
    height: $bulletSize;
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
  }
</style>
