<script lang="ts">
  import ChevronRightSmall from '$components/icons/chevron-right-small.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import { displayMonthDuration, displayRange } from '$lib/date';
  import type { GetConfigQueryResult } from '$types/generated/sanity.types';

  type WorkTimelineItem = NonNullable<
    NonNullable<GetConfigQueryResult>['timeline']
  >[number];

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
    class="bullet text-orange-dark dark:text-orange-light block shrink-0 rounded-xs select-none"
    ><ChevronRightSmall /></span
  >
  <div class="content">
    <h3 class="text-dark pt-1 text-base font-bold transition-colors dark:text-white">
      {title}
    </h3>
    {#if range}
      <p
        class="inline-flex flex-row items-center justify-start gap-x-2 font-sans text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
      >
        <span>{$displayRange(range.start, range.end)}</span><span>&bull;</span><span
          >{$displayMonthDuration(range.start, range.end)}</span
        >
      </p>
    {/if}
    {#if body}
      <div class="-mt-2 -mb-4">
        <PortableText text={body} class="mt-4 mb-3" bodySize="base"></PortableText>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '@styles/mixins';
  @reference 'tailwindcss';

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

      @include mixins.dark {
        @apply border-neutral-400;
      }
    }
  }
</style>
