<script lang="ts">
  import { circInOut } from 'svelte/easing';

  import { maybe } from 'svelte-maybe-transition';

  import { currentLang, t } from '$i18n';
  import Settings from '$stores/settings';

  import EmptyContent from '$components/empty-content.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import Tags from '$components/tags.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { AuthorTimelineItem } from '$types';

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
        }).format(startDate)} ${$t('to')} ${$t('now')}`;
      }

      if (startDate.getFullYear() === endDate.getFullYear()) {
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${new Intl.DateTimeFormat($currentLang, {
            month: 'long',
            day: 'numeric'
          }).format(startDate)} ${$t('to')} ${new Intl.DateTimeFormat($currentLang, {
            day: 'numeric',
            year: 'numeric'
          }).format(endDate)}`;
        }
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'long'
        }).format(startDate)} ${$t('to')} ${new Intl.DateTimeFormat($currentLang, {
          month: 'long'
        }).format(endDate)} ${endDate.getFullYear()}`;
      }

      return `${new Intl.DateTimeFormat($currentLang, {
        month: 'long',
        year: 'numeric'
      }).format(startDate)} ${$t('to')} ${new Intl.DateTimeFormat($currentLang, {
        month: 'long',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return $t('Invalid date');
    }
  };

  const { reduce_motion } = Settings;
</script>

<div class="relative ml-0 mr-2 mt-4 h-fit">
  {#if data}
    <div
      class="absolute left-0 top-[14px] h-[calc(100%_-_14px)] w-[1px] rounded-full bg-dark/40 dark:bg-light/40"
    />
    <div class="-ml-[4px] flex flex-col items-start justify-start gap-4">
      {#each data as item, i}
        <div class="flex w-full flex-row items-start justify-start gap-2">
          <Icon
            width={24}
            height={24}
            icon="ArrowRight"
            class="translate-x-[1px] translate-y-[2.5px] text-dark/40 dark:text-light/40"
          />
          <div class="mr-6 flex w-full flex-col items-start justify-start">
            <h1 class="select-none font-code text-base text-dark/90 dark:text-light/90">
              {dateDisplay(item.range.start, item.range.end)}
            </h1>
            <Hoverable bind:hovered={data[i].hovered}>
              <Tooltip
                text={selected === i
                  ? $t('Click to hide details')
                  : $t('Click to show details')}
                position="bottom"
                disable={!item.body}
              >
                <div
                  class="relative ml-2 mt-2 w-full rounded-lg {data[i].hovered
                    ? 'border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-dark/40'
                    : 'border-dark/40 bg-dark/5 dark:border-light/40 dark:bg-dark/20'} focusOutline overflow-hidden border px-4 py-3 transition-[background-color,border-color]"
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
                  aria-expanded={selected === i}
                  tabindex={0}
                  role="button"
                >
                  <div class="line-clamp-1 select-none font-sans text-base font-bold">
                    {item.title}
                  </div>
                  {#if item.subtitle}
                    <div
                      class="text-gray-700 dark:text-gray-200 mt-1 line-clamp-1 select-none font-sans text-base italic"
                    >
                      {item.subtitle}
                    </div>
                  {/if}
                  {#if selected === i && item.body}
                    <div
                      class="pb-2 font-sans text-base"
                      in:maybe={{
                        fn: $reduce_motion ? 'fade' : 'slide',
                        enable: true,
                        duration: 200,
                        easing: circInOut
                      }}
                      out:maybe={{
                        fn: $reduce_motion ? 'fade' : 'slide',
                        enable: true,
                        duration: 150,
                        easing: circInOut
                      }}
                    >
                      {#if item.skills}
                        <Tags
                          model="project"
                          data={item.skills}
                          classes="my-2 select-none"
                        />
                      {/if}
                      <div class="-mb-5 mt-4">
                        <PortableText text={item.body} />
                      </div>
                    </div>
                  {/if}
                  {#if item.body}
                    <Icon
                      icon="ChevronDown"
                      class="{selected === i
                        ? 'rotate-0'
                        : 'rotate-90'} absolute right-4 top-4 transition-all"
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
