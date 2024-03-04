<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import Divider from '$components/divider.svelte';
  import { initSync, stopSync } from '$components/experiments/toru';
  import Hoverable from '$components/hoverable.svelte';
  import Link from '$components/link.svelte';
  import Spinner from '$components/loading/spinner.svelte';

  import type { ToruData } from '$components/experiments/toru';

  export let initData: ToruData | undefined;

  onMount(() => initSync((res) => (initData = res)));

  onDestroy(() => stopSync());
</script>

<Hoverable let:hovered>
  <div class="relative">
    <article
      class="relative my-6 flex h-fit w-full flex-col items-start justify-center overflow-clip rounded-xl px-7 py-6"
    >
      <header class="w-full pb-2 transition-[color]">
        <h3 class="pb-2 text-2xl font-bold">Toru</h3>
        <p>An Elixir-based API for generating embeds from last.fm listening activity.</p>
        <Divider />
      </header>

      <figure
        class="flex select-none flex-row items-center justify-start gap-5 px-1 pb-2"
      >
        {#if initData}
          <div class="overflop-clip relative flex-shrink-0">
            <img
              src="data:{initData.cover_art.mime_type};base64,{initData.cover_art.data}"
              alt="Album art for the currently playing track"
              class="pointer-events-none aspect-square h-28 w-28 rounded-lg"
            />
            {#if initData.playing}
              <div
                class="absolute left-0 top-0 aspect-square h-full w-full rounded-lg bg-dark/30 transition-colors dark:bg-dark/50"
              />
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  id="np-icon"
                  class="relative flex h-3 w-fit justify-between gap-1 pt-0.5"
                >
                  {#each Array(4) as _}
                    <span
                      class="h-full w-[2px] rounded-full bg-light dark:bg-accent-dark"
                    />
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <div
            class="flex flex-col items-start justify-center gap-1 text-dark/90 transition-[color] dark:text-light/90"
          >
            <h4 class="text-xl font-black">{initData.title ?? 'Unknown title'}</h4>
            <p class="text-base">
              {initData.artist ?? ''}
              {initData.artist && initData.album ? '—' : ''}
              {initData.album ?? ''}
            </p>
          </div>

          <img
            src="data:{initData.cover_art.mime_type};base64,{initData.cover_art.data}"
            alt="Artist art for the currently playing track"
            class="absolute bottom-0 left-0 right-0 top-0 -z-10 h-[150%] w-[150%] opacity-30 blur-xl"
          />
          <div
            class="absolute bottom-0 left-0 right-0 top-0 -z-20 h-[150%] w-[150%] bg-light blur-xl transition-colors dark:bg-dark"
          />
        {:else}
          <div class="flex-shrink-0 p-4">
            <div
              class="relative flex h-28 w-28 items-center justify-center rounded-lg bg-dark/10 transition-colors dark:bg-light/10"
            >
              <Spinner class="ml-0" />
            </div>
          </div>

          <div
            class="flex flex-col items-start justify-center text-dark/90 transition-[color] dark:text-light/90"
          >
            <h4 class="text-xl font-bold">Loading...</h4>
          </div>

          <div
            class="absolute bottom-0 left-0 right-0 top-0 -z-10 h-[150%] w-[150%] bg-dark/10 opacity-30 blur-xl transition-colors dark:bg-light/10"
          />
        {/if}
      </figure>

      <Link
        href="https://github.com/kiosion/toru"
        class="focus-outline absolute right-4 top-4 z-10 rounded-sm p-1"
        tooltipDelay={150}
        newtab
      >
        <svg
          class="h-5 w-5 text-dark/90 hover:text-accent-light/90 focus-visible:text-accent-light/90 dark:text-light/90 hover:dark:text-accent-dark/90 focus-visible:dark:text-accent-dark/90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </article>

    <div
      class="pointer-events-none absolute -bottom-2 left-0 right-0 top-0 -z-40 transition-opacity"
      aria-hidden="true"
      class:opacity-10={!hovered}
      class:opacity-20={hovered}
      class:dark:opacity-15={hovered}
    >
      {#if initData}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src="data:{initData.cover_art.mime_type};base64,{initData.cover_art.data}"
          class="h-full w-full blur-lg"
        />
      {:else}
        <div class="h-full w-full bg-dark/10 dark:bg-light/10" />
      {/if}
    </div>
  </div>
</Hoverable>

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