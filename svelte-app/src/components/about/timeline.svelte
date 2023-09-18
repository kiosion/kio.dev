<script lang="ts">
  import { circInOut } from 'svelte/easing';

  import { maybe } from 'svelte-maybe-transition';

  import { currentLang, t } from '$i18n';
  import Settings from '$stores/settings';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
  import PortableText from '$components/portable-text/portable-text.svelte';
  import Tags from '$components/tags.svelte';
  import Tooltip from '$components/tooltip.svelte';

  import type { AuthorTimelineItem } from '$types';

  let selected: number | null = null;

  export let data: AuthorTimelineItem[];

  const dateDisplay = (start: string, end: string | undefined) => {
    try {
      const startDate = new Date(start),
        endDate = end ? new Date(end) : undefined;

      if (!endDate) {
        return `${new Intl.DateTimeFormat($currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(startDate)} - ${$t('present')}`;
      }

      return `${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(startDate)} - ${new Intl.DateTimeFormat($currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return $t('Invalid date');
    }
  };

  const { reduce_motion } = Settings;
</script>

<div class="flex flex-col items-start justify-start gap-4">
  {#each data as item, i}
    <Hoverable bind:hovered={data[i].hovered}>
      <Tooltip
        text={selected === i ? $t('Click to hide details') : $t('Click to show details')}
        position="bottom"
        disable={!item.body}
      >
        <div
          class="flex w-full flex-col items-start justify-start"
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
          <div class="flex flex-row items-center justify-start gap-4">
            <Icon
              icon="ChevronDown"
              class="{selected === i ? 'rotate-0' : '-rotate-90'} transition-all"
            />
            <div class="flex flex-row flex-wrap items-center justify-start gap-x-4">
              <p
                class="min-w-[10rem] select-none font-code text-base text-dark/90 dark:text-light/90"
              >
                {dateDisplay(item.range.start, item.range.end)}
              </p>
              <div class="flex flex-row items-center justify-start">
                <h1
                  class="text-lg font-bold decoration-accent-light decoration-[3px] underline-offset-4 dark:decoration-accent-dark"
                  class:underline={data[i].hovered}
                >
                  {item.title}
                </h1>
                {#if item.subtitle}
                  <BulletPoint />
                  <p class="text-base">{item.subtitle}</p>
                {/if}
              </div>
            </div>
          </div>
          {#if selected === i && item.body}
            <div
              class="mx-10 pb-2 font-sans text-base"
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
                <Tags model="project" data={item.skills} class="mt-4 select-none" />
              {/if}
              <div class="-mb-5">
                <PortableText text={item.body} />
              </div>
            </div>
          {/if}
        </div>
      </Tooltip>
    </Hoverable>
  {/each}
</div>
