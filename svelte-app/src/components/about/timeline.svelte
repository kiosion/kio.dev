<script lang="ts">
  import ErrorText from '$components/error-text.svelte';
  import type { AuthorTimelineItem } from '$types';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import Icon from '$components/icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import { slide, scale } from 'svelte/transition';
  import { t, currentLang } from '$i18n';
  import Tags from '$components/tags.svelte';

  let selected: number | null = null;

  export let data: AuthorTimelineItem[] | undefined;

  const dateDisplay = (start: string, end: string | undefined) => {
    try {
      const startDate = new Date(start),
        endDate = end ? new Date(end) : undefined;

      if (!endDate) {
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(startDate)} - ${t('now')}`;
      }

      if (startDate.getFullYear() === endDate.getFullYear()) {
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${new Intl.DateTimeFormat($currentLang, {
            month: 'short',
            day: 'numeric'
          }).format(startDate)} - ${new Intl.DateTimeFormat($currentLang, {
            day: 'numeric',
            year: 'numeric'
          }).format(endDate)}`;
        }
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'short'
        }).format(startDate)} - ${new Intl.DateTimeFormat($currentLang, {
          month: 'short'
        }).format(endDate)} ${endDate.getFullYear()}`;
      }

      return `${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(startDate)} - ${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return t('Invalid date');
    }
  };
</script>

<div class="relative h-fit mx-2 mt-4">
  {#if data}
    <div
      class="rounded-full w-[2px] absolute bg-slate-400 dark:bg-slate-300 h-[calc(100%_-_4px)] left-0 top-[4px]"
    />
    <div class="flex flex-col justify-start items-start -ml-[4px] gap-4">
      {#each data as item, i}
        <div class="flex flex-row justify-start items-start gap-2 w-full">
          <Icon
            width={24}
            icon="CornerDownRight"
            classes="text-slate-400 dark:text-slate-300"
          />
          <div class="flex flex-col justify-start items-start w-full mr-6">
            <h1 class="font-code font-bold text-lg select-none">
              {dateDisplay(item.range.start, item.range.end)}
            </h1>
            <Hoverable>
              <div
                class="relative w-full ml-2 mt-2 rounded-lg bg-slate-200/50 dark:bg-slate-900/50 px-4 py-3 transition-all overflow-hidden focusOutline"
                on:click={() => {
                  if (item.body) {
                    selected = selected === i ? null : i;
                  }
                }}
                on:keydown={(e) => {
                  if (item.body && (e.code === 'Enter' || e.code === 'Space')) {
                    selected = selected === i ? null : i;
                  }
                }}
                tabindex={0}
                role="button"
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
                    class="font-sans text-base"
                    in:slide={{ duration: 150 }}
                    out:slide={{ duration: 150 }}
                  >
                    {#if item.skills}
                      <Tags
                        model="project"
                        data={item.skills}
                        classes="my-2 select-none"
                        animate
                      />
                    {/if}
                    <div class="mt-4">
                      <PortableText text={item.body} />
                    </div>
                  </div>
                {/if}
                {#if item.body}
                  <Icon
                    icon="ChevronDown"
                    classes="{selected === i
                      ? 'rotate-0'
                      : 'rotate-90'} transition-all absolute top-4 right-4"
                  />
                {/if}
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
