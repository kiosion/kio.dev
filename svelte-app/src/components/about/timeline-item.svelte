<script lang="ts">
  import { displayMonthDuration, displayRange } from '$lib/date';

  import ChevronRightSmall from '$components/icons/chevron-right-small.svelte';
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
  class:pb-4={!last}
>
  <span
    class="bullet block shrink-0 select-none rounded-xs text-orange-dark dark:text-orange-light"
    ><ChevronRightSmall /></span
  >
  <div class="content">
    <h3 class="pt-1 text-base font-bold text-dark transition-colors dark:text-white">
      {title}
    </h3>
    <p
      class="inline-flex flex-row items-center justify-start gap-x-2 font-sans text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
    >
      <span>{$displayRange(range.start, range.end)}</span><span>&bull;</span><span
        >{$displayMonthDuration(range.start, range.end)}</span
      >
    </p>
    {#if body}
      <div class="-mb-4 -mt-2">
        <PortableText text={body} class="mb-3 mt-4" bodySize="base"></PortableText>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import '@styles/mixins';

  $bulletTopMargin: 10px;
  $bulletSize: 8px;
  $lineWidth: 1px;
  $lineGap: 18px;

  .bullet {
    margin-top: $bulletTopMargin;
    width: $bulletSize;
    height: $bulletSize;
    line-height: $bulletSize;
  }

  .content {
    .last & {
      &:before {
        @apply hidden;
      }
    }

    &:before {
      @apply absolute border-l border-dashed border-neutral-300 transition-colors;

      content: '';
      top: #{$bulletTopMargin + $bulletSize + $lineGap};
      bottom: #{0px + $lineGap - $bulletTopMargin - $bulletSize};
      left: #{$bulletSize * 2 + $lineWidth * 3};

      @include dark {
        @apply border-neutral-400;
      }
    }
  }
</style>
