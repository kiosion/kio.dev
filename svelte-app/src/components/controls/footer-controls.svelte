<script lang="ts">
  import { navOptions } from '$stores/navigation';
  import { goto } from '$app/navigation';
  import SafeIcon from '$components/icons/safe-icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Breakpoints from 'svelte-breakpoints';
  import { DEFAULT_BREAKPOINTS } from '$lib/consts';
  import { t, linkTo, isLocalized, currentLang } from '$i18n';
  import { page } from '$app/stores';
  import SFX from '$lib/sfx';

  let scrollNavHovered = false;

  $: langLink = linkTo($page.url.pathname, $currentLang === 'en' ? 'fr' : 'en');
</script>

<Breakpoints queries={DEFAULT_BREAKPOINTS}>
  <svelte:fragment slot="lg">
    {#if $navOptions.down !== '' || $isLocalized}
      <div
        class="fixed bottom-0 left-40 xl:left-60 right-0 z-[5] rounded-bl-3xl py-6 px-8 bg-slate-100/80 dark:bg-slate-800/80 transition-colors backdrop-blur-md"
      >
        <div class="flex flex-row justify-between items-start">
          <div class="w-52">
            {#if $navOptions.down !== ''}
              <Hoverable bind:hovered={scrollNavHovered}>
                <a
                  data-sveltekit-prefetch
                  href={linkTo($navOptions.down)}
                  class="w-fit flex flex-row items-center select-none {scrollNavHovered
                    ? 'scroll-hover-down'
                    : ''}"
                  on:click={() => SFX.click.play()}
                  on:keydown={(e) => {
                    if (e.code === 'Enter' || e.code === 'Space') {
                      SFX.click.play();
                      goto($navOptions.down).catch(() => undefined);
                    }
                  }}
                >
                  <SafeIcon icon={'ArrowDown'} />
                  <p class="font-code text-base w-fit ml-4">
                    {t('Continue')} ({$navOptions.down})
                  </p>
                </a>
              </Hoverable>
            {/if}
          </div>
          <div class="flex flex-row justify-end items-center gap-2 w-52">
            <Hoverable>
              <a
                class="font-code text-base w-fit"
                role="button"
                aria-label={t('Switch language')}
                href={langLink}
                target="_self"
                on:click={() => SFX.click.play()}
                on:keydown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    SFX.click.play();
                    goto(langLink).catch(() => undefined);
                  }
                }}
              >
                {t('Language')} ({$currentLang})
              </a>
            </Hoverable>
          </div>
        </div>
      </div>
    {/if}
  </svelte:fragment>
</Breakpoints>

<style lang="scss">
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(3px);
    }
    60% {
      transform: translateY(1.5px);
    }
  }

  :global(.scroll-hover-down svg) {
    animation: bounce 2s infinite;
  }
</style>
