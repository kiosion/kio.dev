<script lang="ts">
  import { APP_THEMES, BASE_GIT_URL, BASE_PAGE_TITLE, NAV_LINKS } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import LangToggle from '$components/controls/lang-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import EnvelopeOpenSmall from '$components/icons/envelope-open-small.svelte';
  import EnvelopeSmall from '$components/icons/envelope-small.svelte';
  import GlobeAmericasSmall from '$components/icons/globe-americas-small.svelte';
  import GlobeAsiaAustraliaSmall from '$components/icons/globe-asia-australia-small.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import Link from '$components/link.svelte';
  import SidebarBlock from '$components/sidebar/sidebar-block.svelte';
  import SidebarLink from '$components/sidebar/sidebar-link.svelte';
  import ToruWidget from '$components/sidebar/toru.svelte';

  import type { ToruData } from '$components/sidebar/toru';
  import type { SiteConfig } from '$types';

  export let config: SiteConfig,
    toruData: Promise<ToruData | undefined>,
    scrollContainer: HTMLElement | null | undefined;

  const socials = config?.socialLinks?.map((social) => ({
    name: social.name,
    url: social.url,
    rel: social.rel?.join(' ') || undefined,
    target: social.internal ? undefined : '_blank'
  }));

  const name = config instanceof Error ? BASE_PAGE_TITLE : config.name;

  const { theme } = Settings;

  $: pfp =
    $theme === APP_THEMES.DARK
      ? '/assets/avi/standard_transparent.png'
      : '/assets/avi/line_sunglasses_transparent.png';
</script>

<div
  class="min-h-fith-full flex w-full flex-col gap-5 rounded-xl transition-all duration-300 ease-in-out lg:ml-auto lg:max-w-xs lg:overflow-y-auto xl:max-w-sm 2xl:max-w-md"
>
  <BaseContainer
    class="order-2 flex flex-col items-start justify-start gap-y-4 p-4 lg:order-1"
  >
    <div class="flex w-full flex-shrink-0 flex-row items-center justify-start gap-x-4">
      <img
        class="aspect-square h-14 w-14 flex-shrink-0 select-none rounded-lg bg-neutral-300/50 p-0 dark:bg-neutral-100/50"
        src={pfp}
        alt="kio.dev"
      />
      <div class="flex select-none flex-col items-start justify-center gap-y-0.5">
        <h1
          class="text-lg font-bold text-neutral-900 transition-colors dark:text-neutral-100"
        >
          {name}
        </h1>
        {#if config.handle}
          <p
            class="rounded-full border border-neutral-200 bg-neutral-200/50 px-2 py-1 text-sm text-neutral-500 transition-colors dark:border-neutral-800 dark:bg-neutral-800/75 dark:text-neutral-200"
          >
            {config.handle}
          </p>
        {/if}
      </div>
    </div>

    {#if config.bio && socials}
      <div class="flex flex-col items-start justify-center gap-y-2 pb-2">
        {#if config.bio}
          <p
            class="pb-2 text-md text-neutral-400 transition-colors dark:text-neutral-200"
          >
            {config.bio}
          </p>
        {/if}
        {#if socials}
          <ul
            class="flex select-none flex-col items-start justify-start gap-y-1.5 text-base"
            role="list"
          >
            {#each socials as social}
              <li
                class="group flex flex-row items-center justify-start gap-x-2 text-neutral-700 transition-colors dark:text-neutral-200"
                role="listitem"
              >
                {#if social.url.includes('mailto')}
                  <EnvelopeSmall
                    class="mt-px group-hover:hidden group-focus-visible:hidden"
                  />
                  <EnvelopeOpenSmall
                    class="hidden group-hover:block group-focus-visible:block"
                  />
                {:else}
                  <GlobeAmericasSmall
                    class="mt-px group-hover:hidden group-focus-visible:hidden"
                  />
                  <GlobeAsiaAustraliaSmall
                    class="mt-px hidden group-hover:block group-focus-visible:block"
                  />
                {/if}
                <Link href={social.url} newtab>
                  {social.name}
                </Link>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}

    <nav class="-mb-2 flex w-full flex-col items-start justify-center gap-y-2">
      <p
        class="select-none text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-300"
      >
        {$t('Pages')}
      </p>
      <ul
        class="flex w-full select-none flex-col items-start justify-start gap-y-1"
        role="navigation"
      >
        {#each NAV_LINKS as link}
          <li class="h-fit w-full">
            <SidebarLink {link} />
          </li>
        {/each}
      </ul>
    </nav>
  </BaseContainer>

  <BaseContainer
    class="group/container order-1 flex flex-row gap-2 p-2 px-3 group-first/container:border-r-2 lg:order-2 print:hidden"
  >
    <LangToggle />
    <ThemeToggle />
  </BaseContainer>

  <SidebarBlock {scrollContainer} />

  {#if config.enableToru}
    <ToruWidget initPromise={toruData} />
  {/if}

  {#if APP_VERSION?.length}
    <div
      class="order-5 mt-auto hidden w-full flex-row items-center justify-center gap-x-2 p-2 text-sm lg:flex"
    >
      <span class="text-neutral-600/30 dark:text-neutral-200/40"
        ><a
          href={`${BASE_GIT_URL}/commit/${APP_VERSION}`}
          class="focus-outline-sm rounded-xs font-medium hover:underline"
          target="_blank"
          rel="noopener noreferrer">#{APP_VERSION.slice(0, 6)}</a
        ></span
      >
    </div>
  {/if}
</div>
