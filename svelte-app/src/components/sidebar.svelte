<script lang="ts">
  import { NAV_LINKS } from '$lib/consts';
  import { t } from '$lib/i18n';

  import LangToggle from '$components/controls/lang-toggle.svelte';
  import ThemeToggle from '$components/controls/theme-toggle.svelte';
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
  class="min-h-fith-full flex w-full flex-col gap-5 rounded-xl lg:max-w-xs lg:overflow-y-auto xl:max-w-sm 2xl:max-w-md"
>
  <BaseContainer
    class="lg:orger-1 order-2 flex flex-col items-start justify-start gap-y-4 p-4"
  >
    <div class="flex w-full flex-shrink-0 flex-row items-center justify-start gap-x-4">
      <img
        class="aspect-square h-14 w-14 flex-shrink-0 select-none rounded-lg bg-orange-light/40 p-0 transition-colors dark:bg-orange-light/60"
        src="/assets/tmp_avi.jpg"
        alt="kio.dev"
      />
      <div class="flex flex-col items-start justify-center gap-y-0.5">
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
      <ul class="flex flex-col items-start justify-start gap-y-1.5 text-base">
        {#each socials as social}
          <li
            class="flex flex-row items-center justify-start gap-x-2 text-neutral-700 transition-colors dark:text-neutral-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="mt-px size-4"
            >
              {#if social.url.includes('mailto')}
                <path
                  fill-rule="evenodd"
                  d="M1.756 4.568A1.5 1.5 0 0 0 1 5.871V12.5A1.5 1.5 0 0 0 2.5 14h11a1.5 1.5 0 0 0 1.5-1.5V5.87a1.5 1.5 0 0 0-.756-1.302l-5.5-3.143a1.5 1.5 0 0 0-1.488 0l-5.5 3.143Zm1.82 2.963a.75.75 0 0 0-.653 1.35l4.1 1.98a2.25 2.25 0 0 0 1.955 0l4.1-1.98a.75.75 0 1 0-.653-1.35L8.326 9.51a.75.75 0 0 1-.652 0L3.575 7.53Z"
                  clip-rule="evenodd"
                />
              {:else}
                <path
                  fill-rule="evenodd"
                  d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 3.757a5.5 5.5 0 1 0 6.857-.114l-.65.65a.707.707 0 0 0-.207.5c0 .39-.317.707-.707.707H8.427a.496.496 0 0 0-.413.771l.25.376a.481.481 0 0 0 .616.163.962.962 0 0 1 1.11.18l.573.573a1 1 0 0 1 .242 1.023l-1.012 3.035a1 1 0 0 1-1.191.654l-.345-.086a1 1 0 0 1-.757-.97v-.305a1 1 0 0 0-.293-.707L6.1 9.1a.849.849 0 0 1 0-1.2c.22-.22.22-.58 0-.8l-.721-.721A3 3 0 0 1 4.5 4.257v-.5Z"
                  clip-rule="evenodd"
                />
              {/if}
            </svg>
            <Link href={social.url} newtab>
              {social.name}
            </Link>
          </li>
        {/each}
      </ul>
    </div>

    <nav class="-mb-2 flex w-full flex-col items-start justify-center gap-y-2">
      <p
        class="select-none text-sm font-medium text-neutral-600 transition-colors dark:text-neutral-200"
      >
        {$t('Contents')}
      </p>
      <ul class="flex w-full flex-col items-start justify-start gap-y-1">
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
</div>
