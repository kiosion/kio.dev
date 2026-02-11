<script lang="ts">
  import Spinner from '$components/loading/spinner.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import ExclamationCircle from '$components/icons/exclamation-circle.svelte';
  import type { WakaTimeStatsResponse } from '$types/wakatime';

  let { data }: { data: Promise<WakaTimeStatsResponse | undefined> } = $props();

  const MAX_LANGUAGES = 5;
  const MAX_EDITORS = 3;
  const MAX_CATEGORIES = 3;

  const formatDuration = (seconds: number): string => {
    const largestUnits = 2;
    const units = [
      { label: 'day', value: 86400 },
      { label: 'hr', value: 3600 },
      { label: 'min', value: 60 },
      { label: 'sec', value: 1 },
    ];

    const result = [];
    let remainingSeconds = seconds;

    for (const { label, value } of units) {
      if (result.length >= largestUnits) {
        break;
      }
      const unitAmount = Math.floor(remainingSeconds / value);
      if (unitAmount > 0) {
        result.push(`${unitAmount} ${label}${unitAmount > 1 ? 's' : ''}`);
        remainingSeconds -= unitAmount * value;
      }
    }

    return result.join(' ');
  };
</script>

{#snippet summaryCol(label: string, value: string)}
  <span class="flex flex-row items-baseline gap-1.5 font-mono tracking-tight">
    <span>{value}</span>
    <span class="text-base opacity-50">{label}</span>
  </span>
{/snippet}

{#snippet graphItem(label: string, percent: number, detail: string, delay: number)}
  <Tooltip content={detail} followCursor>
    <div class="group -my-2 flex cursor-default items-center gap-3 py-2 select-none">
      <span
        class="w-24 shrink-0 truncate text-right text-sm opacity-70 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <div
        class="h-1 w-44 shrink-0 overflow-hidden rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200 group-focus-visible:bg-neutral-200 dark:bg-neutral-600 group-hover:dark:bg-neutral-500 group-focus-visible:dark:bg-neutral-500">
        <div
          class="bar-fill bg-orange-light dark:bg-orange-dark h-full rounded-full"
          style="width: {percent}%; animation-delay: {delay}ms">
        </div>
      </div>
      <span class="text-sm opacity-50 transition-opacity group-hover:opacity-80">
        {percent.toFixed(1)}%
      </span>
    </div>
  </Tooltip>
{/snippet}

{#snippet errorText(message: string)}
  <div class="flex flex-row gap-2 items-center justify-start pl-2 font-mono text-sm">
    Error:&nbsp;{message}
  </div>
{/snippet}

<section class="flex w-full flex-col gap-6 lg:max-w-[56rem]">
  <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">Fun stats</h1>

  <div
    class="rounded-sm border border-neutral-200 px-5 py-4 sm:px-6 sm:py-5 dark:border-neutral-500">
    <div class="flex flex-col gap-6">
      {#await data}
        <div>
          <Spinner text="loading code stats" />
        </div>

        <div>
            <span class="font-mono text-sm opacity-70"
            >&dollar;&nbsp;wakatime stats --range=last_year
            </span>
        </div>
      {:then stats}
        {#if stats}
          {@const d = stats.data}

          <div class="flex flex-col gap-8 pl-2">
            <div class="flex flex-col gap-3">
              <span class="font-mono text-sm opacity-50">by the numbers</span>
              <div class="flex flex-row flex-wrap gap-x-6 gap-y-2 sm:gap-x-8">
                {@render summaryCol(
                  'total',
                  formatDuration(d.total_seconds_including_other_language),
                )}
                {@render summaryCol(
                  'daily avg',
                  formatDuration(d.daily_average_including_other_language),
                )}
                {@render summaryCol('languages', String(d.languages?.length ?? 0))}
                {#if d.days_including_holidays > 0}
                  {@render summaryCol(
                    'active days',
                    `${Math.round(
                      (d.days_minus_holidays / d.days_including_holidays) * 100,
                    )}%`,
                  )}
                {/if}
              </div>
            </div>

            <div class="flex flex-col flex-wrap gap-x-14 gap-y-8 md:flex-row">
              {#if d.languages?.length}
                <div class="flex flex-col gap-4">
                  <span class="font-mono text-sm opacity-50">languages</span>
                  <div class="flex flex-col gap-2.5">
                    {#each d.languages.slice(0, MAX_LANGUAGES) as lang, i}
                      {@render graphItem(lang.name, lang.percent, lang.text, i * 60)}
                    {/each}
                    {@render graphItem(
                      'Other',
                      d.languages
                        .slice(MAX_LANGUAGES)
                        .reduce((sum, l) => sum + l.percent, 0),
                      formatDuration(
                        d.languages
                          .slice(MAX_LANGUAGES)
                          .reduce((sum, l) => sum + l.total_seconds, 0),
                      ),
                      MAX_LANGUAGES * 60,
                    )}
                  </div>
                </div>
              {/if}

              {#if d.editors?.length}
                <div class="flex flex-col gap-4">
                  <span class="font-mono text-sm opacity-50">editors</span>
                  <div class="flex flex-col gap-2.5">
                    {#each d.editors.slice(0, MAX_EDITORS) as editor, i}
                      {@render graphItem(
                        editor.name,
                        editor.percent,
                        editor.text,
                        i * 60,
                      )}
                    {/each}
                    {@render graphItem(
                      'Other',
                      d.editors.slice(MAX_EDITORS).reduce((sum, e) => sum + e.percent, 0),
                      formatDuration(
                        d.editors
                          .slice(MAX_EDITORS)
                          .reduce((sum, e) => sum + e.total_seconds, 0),
                      ),
                      MAX_EDITORS * 60,
                    )}
                  </div>
                </div>
              {/if}

              {#if d.categories?.length}
                <div class="flex flex-col gap-4">
                  <span class="font-mono text-sm opacity-50">categories</span>
                  <div class="flex flex-col gap-2.5">
                    {#each d.categories.slice(0, MAX_CATEGORIES) as category, i}
                      {@render graphItem(
                        category.name,
                        category.percent,
                        category.text,
                        i * 60,
                      )}
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {:else}
          {@render errorText('No stats available')}
        {/if}
      {:catch e}
        {@render errorText(`Unable to fetch stats: ${e.message}`)}
      {/await}
    </div>
  </div>
</section>

<style lang="scss">
  .bar-fill {
    animation: bar-grow 500ms ease-out both;
  }

  @keyframes bar-grow {
    from {
      width: 0%;
    }
  }
</style>
