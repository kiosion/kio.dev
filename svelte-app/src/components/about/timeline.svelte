<script lang="ts">
  import ErrorText from '$components/error-text.svelte';
  import type { AuthorTimelineItem } from '$lib/types';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import moment from 'moment';
  import Hoverable from '$components/hoverable.svelte';
  import { slide } from 'svelte/transition';

  let selected: number | null = 0;

  export let data: AuthorTimelineItem[] | undefined;
</script>

<div class="relative h-fit mx-2 mt-4">
  {#if data}
    <div
      class="rounded-full w-[2px] absolute bg-slate-400 dark:bg-slate-300 h-[calc(100%_-_4px)] left-0 top-[4px]"
    />
    <div class="flex flex-col justify-start items-start -ml-[4px] gap-4">
      {#each data as item, i}
        <div class="flex flex-row justify-start items-start gap-2 w-full">
          <SafeIcon
            width={24}
            icon="CornerDownRight"
            classes="text-slate-400 dark:text-slate-300"
          />
          <div class="flex flex-col justify-start items-start w-full mr-6">
            <h1 class="font-code font-bold text-lg select-none">
              {#if !item.range.end}
                {moment(item.range.start).format('MMM YYYY')} - now
              {:else if moment(item.range.start).format('MMM YYYY') === moment(item.range.end).format('MMM YYYY')}
                {moment(item.range.start).format('MMM DD')} - {moment(
                  item.range.end
                ).format('DD, YYYY')}
              {:else if moment(item.range.start).format('YYYY') === moment(item.range.end).format('YYYY')}
                {moment(item.range.start).format('MMM DD')} - {moment(
                  item.range.end
                ).format('MMM DD, YYYY')}
              {:else}
                {moment(item.range.start).format('MMM DD, YYYY')} - {moment(
                  item.range.end
                ).format('MMM DD, YYYY')}
              {/if}
            </h1>
            <Hoverable>
              <div
                class="relative w-full ml-2 mt-2 rounded-md bg-slate-200 dark:bg-slate-900 px-4 py-3 transition-all overflow-hidden"
                on:click={() =>
                  item.body &&
                  (selected === i ? (selected = null) : (selected = i))}
                tabindex={0}
              >
                <div
                  class="font-sans font-bold text-base line-clamp-1 select-none"
                >
                  {item.title}
                </div>
                {#if item.subtitle}
                  <div
                    class="font-sans italic text-base mt-1 line-clamp-1 select-none text-slate-700 dark:text-slate-200"
                  >
                    {item.subtitle}
                  </div>
                {/if}
                {#if selected === i && item.body}
                  <div
                    class="font-sans text-base -mt-2 -mb-4 line-clamp-2"
                    in:slide={{ duration: 150 }}
                    out:slide={{ duration: 150 }}
                  >
                    <PortableText text={item.body} />
                  </div>
                {/if}
                <SafeIcon
                  icon="ChevronDown"
                  classes="{selected === i
                    ? 'rotate-0'
                    : 'rotate-90'} transition-all absolute top-4 right-4"
                />
              </div>
            </Hoverable>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <ErrorText text="No data" classes="w-fit" />
  {/if}
</div>
