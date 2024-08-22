<script lang="ts">
  import { BASE_GIT_URL, NAV_LINKS } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import { t } from '$lib/i18n';

  import LangToggle from '$components/controls/lang-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import EnvelopeOpenSmall from '$components/icons/envelope-open-small.svelte';
  import EnvelopeSmall from '$components/icons/envelope-small.svelte';
  import GlobeAmericasSmall from '$components/icons/globe-americas-small.svelte';
  import GlobeAsiaAustraliaSmall from '$components/icons/globe-asia-australia-small.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';
  import Link from '$components/link.svelte';
  import HeaderLink from '$components/nav/header-link.svelte';
  import SidebarBlock from '$components/sidebar/sidebar-block.svelte';
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
</script>

<div
  class="min-h-fith-full flex w-full flex-col gap-5 rounded-xl transition-all duration-300 ease-in-out lg:ml-auto lg:max-w-xs lg:overflow-y-auto xl:max-w-sm 2xl:max-w-md"
>
  <BaseContainer
    class="order-2 flex flex-col items-start justify-start gap-y-4 p-4 lg:order-1"
  >
    <div class="flex w-full flex-shrink-0 flex-row items-center justify-start gap-x-4">
      <img
        class="aspect-square h-14 w-14 flex-shrink-0 select-none rounded-lg bg-orange-light/40 p-0 transition-colors dark:bg-orange-light/60"
        src="/assets/tmp_avi.png"
        alt="kio.dev"
      />
      <div class="flex select-none flex-col items-start justify-center gap-y-0.5">
        <h1
          class="text-lg font-bold text-neutral-900 transition-colors dark:text-neutral-100"
        >
          {config.name}
        </h1>
        {#if config.handle}
          <p
            class="rounded-full border border-neutral-200 bg-neutral-0/75 px-2 py-1 text-sm text-neutral-500 transition-colors dark:border-neutral-800 dark:bg-neutral-800/75 dark:text-neutral-200"
          >
            {config.handle}
          </p>
        {/if}
      </div>
    </div>

    <div class="flex flex-col items-start justify-center gap-y-2 pb-2">
      {#if config.bio}
        <p class="pb-2 text-md text-neutral-400 transition-colors dark:text-neutral-200">
          {config.bio}
        </p>
      {/if}
      <ul
        class="flex select-none flex-col items-start justify-start gap-y-1.5 text-base"
        role="list"
      >
        {#each socials as social}
          <Hoverable let:hovered>
            <li
              class="flex flex-row items-center justify-start gap-x-2 text-neutral-700 transition-colors dark:text-neutral-200"
              role="listitem"
            >
              <svelte:component
                this={social.url.includes('mailto')
                  ? hovered
                    ? EnvelopeOpenSmall
                    : EnvelopeSmall
                  : hovered
                    ? GlobeAsiaAustraliaSmall
                    : GlobeAmericasSmall}
                class="mt-px"
              />
              <Link href={social.url} newtab>
                {social.name}
              </Link>
            </li>
          </Hoverable>
        {/each}
      </ul>
    </div>

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
            <HeaderLink {link} />
          </li>
        {/each}
      </ul>
    </nav>
  </BaseContainer>

  <BaseContainer class="order-1 flex flex-row gap-2 p-2 lg:order-2 print:hidden">
    <LangToggle />
    <ThemeToggle />
  </BaseContainer>

  <SidebarBlock {scrollContainer} />

  {#if config.enableToru}
    <ToruWidget initPromise={toruData} />
  {/if}

  {#if APP_VERSION?.length}
    <div
      class="order-5 mt-auto flex w-full flex-row items-center justify-center gap-x-2 p-2 text-sm"
    >
      <span class="text-neutral-600/30 dark:text-neutral-200/40"
        ><a
          href={`${BASE_GIT_URL}/commit/${APP_VERSION}`}
          class="font-medium hover:underline"
          target="_blank"
          rel="noopener noreferrer">#{APP_VERSION.slice(0, 6)}</a
        ></span
      >
    </div>
  {/if}
</div>
