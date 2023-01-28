<script lang="ts">
  import type { AuthorTimelineItem } from '$types';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import Icon from '$components/icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import { maybe } from '$lib/helpers/animate';
  import Features from '$stores/features';
  import { t, currentLang } from '$i18n';
  import Tags from '$components/tags.svelte';
  import Tooltip from '$components/tooltip.svelte';
  import EmptyContent from '$components/empty-content.svelte';

  let selected: number | null = null;

  export let data: AuthorTimelineItem[] | undefined;

  const dateDisplay = (start: string, end: string | undefined) => {
    try {
      const startDate = new Date(start),
        endDate = end ? new Date(end) : undefined;

      if (!endDate) {
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'long',
          year: 'numeric'
        }).format(startDate)} ${t('to')} ${t('now')}`;
      }

      if (startDate.getFullYear() === endDate.getFullYear()) {
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${new Intl.DateTimeFormat($currentLang, {
            month: 'long',
            day: 'numeric'
          }).format(startDate)} ${t('to')} ${new Intl.DateTimeFormat(
            $currentLang,
            {
              day: 'numeric',
              year: 'numeric'
            }
          ).format(endDate)}`;
        }
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'long'
        }).format(startDate)} ${t('to')} ${new Intl.DateTimeFormat(
          $currentLang,
          {
            month: 'long'
          }
        ).format(endDate)} ${endDate.getFullYear()}`;
      }

      return `${new Intl.DateTimeFormat($currentLang, {
        month: 'long',
        year: 'numeric'
      }).format(startDate)} ${t('to')} ${new Intl.DateTimeFormat($currentLang, {
        month: 'long',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return t('Invalid date');
    }
  };

  $: reduceMotion = Features.can('reduce motion');
</script>

<div class="relative h-fit ml-0 mr-2 mt-4">
  {#if data}
    <div
      class="rounded-full w-[1px] absolute bg-stone-400 dark:bg-stone-400/40 h-[calc(100%_-_14px)] left-0 top-[14px]"
    />
    <div class="flex flex-col justify-start items-start -ml-[4px] gap-4">
      {#each data as item, i}
        <div class="flex flex-row justify-start items-start gap-2 w-full">
          <Icon
            width={24}
            height={24}
            icon="CornerDownRight"
            classes="text-stone-400 dark:text-stone-400/40 -translate-x-[1px]"
            style="clip-path: inset(24px 18px 24px 24px)"
          />
          <div class="flex flex-col justify-start items-start w-full mr-6">
            <h1
              class="font-code font-bold text-lg select-none text-stone-800 dark:text-stone-50/90"
            >
              {dateDisplay(item.range.start, item.range.end)}
            </h1>
            <Hoverable bind:hovered={data[i].hovered}>
              <Tooltip
                text={selected === i
                  ? t('Click to hide details')
                  : t('Click to show details')}
                position="bottom"
                disable={!item.body}
              >
                <div
                  class="relative w-full ml-2 mt-2 rounded-lg {data[i].hovered
                    ? 'bg-stone-300/60 dark:bg-stone-700/20 border-stone-400/80 dark:border-stone-500/80'
                    : 'bg-stone-300/20 dark:bg-stone-900/40 border-stone-400/60 dark:border-stone-500/60'} border px-4 py-3 transition-all overflow-hidden focusOutline"
                  on:click={() => {
                    if (item.body) {
                      selected = selected === i ? null : i;
                    }
                  }}
                  on:keydown={(e) => {
                    if (
                      item.body &&
                      (e.code === 'Enter' || e.code === 'Space')
                    ) {
                      selected = selected === i ? null : i;
                    }
                  }}
                  aria-expanded={selected === i}
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
                      class="font-sans italic text-base mt-1 line-clamp-1 select-none text-gray-700 dark:text-gray-200"
                    >
                      {item.subtitle}
                    </div>
                  {/if}
                  {#if selected === i && item.body}
                    <div
                      class="font-sans text-base pb-2"
                      in:maybe={{
                        fn: $reduceMotion ? 'fade' : 'slide',
                        animate: true,
                        duration: 150
                      }}
                      out:maybe={{
                        fn: $reduceMotion ? 'fade' : 'slide',
                        animate: true,
                        duration: 150
                      }}
                    >
                      {#if item.skills}
                        <Tags
                          model="project"
                          data={item.skills}
                          classes="my-2 select-none"
                        />
                      {/if}
                      <div class="mt-4 -mb-5">
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
              </Tooltip>
            </Hoverable>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <EmptyContent />
  {/if}
</div>
