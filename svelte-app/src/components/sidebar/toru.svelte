<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import type { ToruData } from '$components/sidebar/toru';
  import { data, initSync, stopSync } from '$components/sidebar/toru';
  import { BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import { isDesktop } from '$lib/responsive';
  import { blur } from 'svelte/transition';

  export let initPromise: Promise<ToruData | undefined>;

  const blurInOpts = {
      duration: BASE_ANIMATION_DURATION,
      amount: 10
    },
    blurOutOpts = {
      duration: BASE_ANIMATION_DURATION,
      amount: 10
    };

  onMount(() =>
    initPromise.then((res) => {
      data.set(res);
      initSync();
    })
  );

  onDestroy(() => stopSync());

  $: ({ artist, title, playing, url, cover_art, album } = $data ?? {
    artist: undefined,
    title: undefined,
    playing: false,
    url: undefined,
    cover_art: undefined,
    album: undefined
  });
</script>

{#if $data && $isDesktop}
  <a
    href={url ?? '#'}
    target={url ? '_blank' : undefined}
    rel={url ? 'noopener noreferrer' : undefined}
    class="focus-outline-sm group relative order-4 flex flex-row items-center justify-start gap-4 rounded-xl border border-neutral-200/50 bg-neutral-100 p-3 transition-colors duration-150 ease-in-out select-none hover:bg-neutral-100/75 dark:border-neutral-500/90 dark:bg-neutral-600 dark:hover:bg-neutral-600/75 print:hidden"
    class:cursor-pointer={url}
    in:blur={blurInOpts}
    out:blur={blurOutOpts}
  >
    <div class="relative flex-shrink-0 overflow-clip rounded-lg">
      <img
        src="data:{cover_art?.mime_type};base64,{cover_art?.data}"
        alt="Album art for the currently playing track"
        class="pointer-events-none aspect-square h-20 w-20 rounded-lg"
      />
      {#if playing}
        <div
          class="absolute top-0 left-0 aspect-square h-full w-full rounded-lg bg-neutral-700/40 transition-all group-hover:opacity-0 group-focus-visible:opacity-0 dark:bg-neutral-700/50"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
        >
          <div id="np-icon" class="relative flex h-2.5 w-fit justify-between gap-1">
            {#each Array(4) as _}
              <span class="bg-orange-light h-full w-[2px] rounded-full"></span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="flex flex-col items-start justify-center gap-1">
      <p
        class="text-sm font-medium text-neutral-500 transition-colors dark:text-neutral-300"
      >
        {$t(playing ? 'toru.status.playing' : 'toru.status.paused')}
      </p>
      <div
        class="flex flex-col items-start justify-center pb-1 text-neutral-600 transition-colors dark:text-neutral-100"
      >
        <p class="text-md line-clamp-1 font-bold">
          {title ?? 'Unknown title'}
        </p>

        <p class="line-clamp-1 text-sm">
          {artist ?? ''}
          {artist && album ? '—' : ''}
          {album ?? ''}
        </p>
      </div>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      class="absolute top-4 right-4 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <path
        d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"
      />
      <path
        d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"
      />
    </svg>
  </a>
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
