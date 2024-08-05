<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { circIn, circOut } from 'svelte/easing';
  import { blur, fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import { isDesktop } from '$lib/responsive';

  import Hoverable from '$components/hoverable.svelte';
  import { initSync, stopSync } from '$components/sidebar/toru';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { ToruData } from '$components/sidebar/toru';

  export let initPromise: Promise<ToruData | undefined>;

  let data: ToruData | undefined;

  const blurInOpts = {
      duration: BASE_ANIMATION_DURATION * 0.8,
      amount: 12,
      easing: circOut
    },
    blurOutOpts = {
      duration: BASE_ANIMATION_DURATION * 0.8,
      amount: 12,
      easing: circIn
    },
    fadeInOpts = {
      duration: BASE_ANIMATION_DURATION * 0.5
    },
    fadeOutOpts = {
      duration: BASE_ANIMATION_DURATION * 0.5
    };

  const onUpdate = (res: ToruData) => (data = res);

  onMount(() =>
    initPromise.then((res) => {
      data = res;
      initSync(onUpdate);
    })
  );

  onDestroy(() => stopSync(onUpdate));
</script>

{#if data && $isDesktop}
  <Tooltip
    text={`${data.artist ?? ''}${data.artist && data.title ? ' — ' : ''}${data.title ?? ''}`}
  >
    <Hoverable let:hovered>
      <a
        href={data.url ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        class="relative order-4 flex select-none flex-row items-center justify-start gap-4 rounded-xl bg-neutral-100 p-3 transition-colors ease-in-out hover:bg-neutral-100/75 dark:bg-neutral-600 dark:hover:bg-neutral-600/75 print:hidden"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        <div class="relative flex-shrink-0 overflow-clip rounded-lg">
          <img
            src="data:{data.cover_art.mime_type};base64,{data.cover_art.data}"
            alt="Album art for the currently playing track"
            class="pointer-events-none aspect-square h-20 w-20 rounded-lg"
          />
          {#if data.playing && !hovered}
            <div
              class="absolute left-0 top-0 aspect-square h-full w-full rounded-lg bg-neutral-700/40 transition-colors dark:bg-neutral-700/50"
              in:fade={fadeInOpts}
              out:fade={fadeOutOpts}
            ></div>
            <div
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              in:fade={fadeInOpts}
              out:fade={fadeOutOpts}
            >
              <div id="np-icon" class="relative flex h-2.5 w-fit justify-between gap-1">
                {#each Array(4) as _}
                  <span class="h-full w-[2px] rounded-full bg-orange-light"></span>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="flex flex-col items-start justify-center gap-0.5">
          <p
            class="text-sm font-medium text-neutral-500 transition-colors dark:text-neutral-300"
          >
            {$t(data.playing ? 'toru.status.playing' : 'toru.status.paused')}
          </p>
          <div
            class="flex flex-col items-start justify-center text-neutral-600 transition-colors dark:text-neutral-100"
          >
            <p class="line-clamp-1 text-md font-bold">
              {data.title ?? 'Unknown title'}
            </p>

            <p class="line-clamp-1 text-sm">
              {data.artist ?? ''}
              {data.artist && data.album ? '—' : ''}
              {data.album ?? ''}
            </p>
          </div>
        </div>
      </a>
    </Hoverable>
  </Tooltip>
{/if}

<style lang="scss">
  @keyframes bounce {
    10% {
      transform: scaleY(0.35);
    }

    30% {
      transform: scaleY(1);
    }

    60% {
      transform: scaleY(0.5);
    }

    80% {
      transform: scaleY(0.75);
    }

    100% {
      transform: scaleY(0.6);
    }
  }

  #np-icon {
    span {
      content: '';
      animation: bounce 2.2s ease infinite alternate;

      &:nth-of-type(2) {
        animation-delay: -2.2s;
      }

      &:nth-of-type(3) {
        animation-delay: -3.7s;
      }
    }
  }
</style>
