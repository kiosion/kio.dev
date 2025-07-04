<script lang="ts">
  import { t } from '$lib/i18n';

  import Divider from '$components/divider.svelte';
  import CodeBracket from '$components/icons/code-bracket.svelte';
  import Link from '$components/link.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import { data } from '$components/sidebar/toru';

  $: ({ artist, title, playing, url, cover_art, album } = $data ?? {
    artist: undefined,
    title: undefined,
    playing: false,
    url: undefined,
    cover_art: undefined,
    album: undefined
  });
</script>

<div
  class="group relative block rounded-lg"
  class:focus-outline={url}
  class:cursor-pointer={url}
  tabindex={url ? 0 : -1}
  role="button"
  on:click={(e) => {
    if (e.target instanceof SVGElement || e.target instanceof HTMLLinkElement) {
      return;
    }
    if (url) {
      window.open(url, '_blank');
    }
  }}
  on:keyup={(e) => {
    if (e.target instanceof SVGElement || e.target instanceof HTMLLinkElement) {
      return;
    }
    if (e.key === 'Enter' && url) {
      window.open(url, '_blank');
    }
  }}
>
  <article
    class="relative my-6 flex h-fit w-full flex-col items-start justify-center overflow-clip rounded-xl px-7 py-6"
  >
    <header class="z-10 w-full pb-2 transition-[color]">
      <h3 class="pb-2 font-display text-2xl font-bold">{$t('Toru')}</h3>
      <p>
        {$t('An Elixir-based API for generating embeds from last.fm listening activity.')}
      </p>
      <Divider></Divider>
    </header>

    <Link
      href="https://github.com/kiosion/toru"
      class="focus-outline absolute right-4 top-4 z-10 rounded-lg p-2 font-mono text-sm transition-colors hover:bg-neutral-light/50 hover:text-orange-light focus-visible:bg-neutral-light/50 dark:hover:bg-neutral-dark/50 dark:focus-visible:bg-neutral-dark/50 dark:focus-visible:text-orange-light"
      newtab
    >
      <CodeBracket />
    </Link>

    <figure class="flex select-none flex-row items-center justify-start gap-5 px-1 pb-2">
      {#if data}
        <div class="relative z-10 flex-shrink-0 overflow-clip">
          <img
            src="data:{cover_art?.mime_type};base64,{cover_art?.data}"
            alt="Album art for the currently playing track"
            class="pointer-events-none aspect-square h-28 w-28 rounded-lg"
          />
          {#if playing}
            <div
              class="absolute left-0 top-0 aspect-square h-full w-full rounded-lg bg-dark/30 transition-colors dark:bg-dark/50"
            ></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                id="np-icon"
                class="relative flex h-3 w-fit justify-between gap-1 pt-0.5"
              >
                {#each Array(4) as _}
                  <span class="h-full w-[2px] rounded-full bg-orange-light"></span>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div
          class="z-10 flex flex-col items-start justify-center gap-1 text-dark/90 transition-[color] dark:text-light/90"
        >
          <h4
            class="line-clamp-2 text-xl font-black decoration-orange-light decoration-2 underline-offset-4 dark:decoration-orange-light"
            class:group-focus:underline={url}
            class:group-hover:underline={url}
          >
            {title ?? 'Unknown title'}
          </h4>
          <p
            class="line-clamp-2 text-base decoration-orange-light decoration-2 underline-offset-4 dark:decoration-orange-light"
            class:group-hover:underline={artist}
            class:group-focus:underline={artist}
          >
            {artist ?? ''}
            {artist && album ? '—' : ''}
            {album ?? ''}
          </p>
        </div>

        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src="data:{cover_art?.mime_type};base64,{cover_art?.data}"
          class="absolute bottom-0 left-0 right-0 top-0 z-[2] h-[150%] w-[150%] opacity-30 blur-xl"
        />
        <div
          class="absolute bottom-0 left-0 right-0 top-0 z-[1] h-[150%] w-[150%] bg-light blur-xl transition-colors dark:bg-dark"
        ></div>
      {:else}
        <div class="relative flex-shrink-0 overflow-clip">
          <div
            class="flex h-28 w-28 items-center justify-center rounded-lg bg-dark/10 transition-colors dark:bg-light/10"
          >
            <Spinner class="ml-0"></Spinner>
          </div>
        </div>

        <div
          class="flex flex-col items-start justify-center text-dark/90 transition-[color] dark:text-light/90"
        >
          <h4 class="text-xl font-bold">{$t('Loading')}...</h4>
        </div>

        <div
          class="absolute bottom-0 left-0 right-0 top-0 h-[150%] w-[150%] bg-dark/10 opacity-30 blur-xl transition-colors dark:bg-light/10"
        ></div>
      {/if}
    </figure>
  </article>

  <div
    class="pointer-events-none absolute -bottom-2 left-0 right-0 top-0 z-0 opacity-10 transition-opacity group-hover:opacity-20 group-focus:opacity-20 group-hover:dark:opacity-15 group-focus:dark:opacity-15"
    aria-hidden="true"
  >
    {#if data}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src="data:{cover_art?.mime_type};base64,{cover_art?.data}"
        class="h-full w-full blur-lg"
      />
    {:else}
      <div class="h-full w-full bg-dark/10 dark:bg-light/10"></div>
    {/if}
  </div>
</div>

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
