<script lang="ts">
  import { BASE_GIT_URL } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import { t } from '$lib/i18n';

  import BaseLink from '$components/nav/base-link.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { SiteConfig } from '$types';

  export let config: SiteConfig;

  const socials = config?.socialLinks?.map((social) => ({
    name: social.name,
    url: social.url,
    rel: social.rel?.join(' ') || undefined,
    target: social.internal ? undefined : '_blank'
  }));
</script>

{#if socials?.length || APP_VERSION?.length}
  <footer
    class="flex flex-row items-center justify-between border-t border-dark/80 px-7 py-5 font-mono text-[13.5px] transition-[border-color] dark:border-light/60 print:hidden"
  >
    {#if socials?.length}
      <div class="flex select-none flex-row items-center justify-start gap-x-2">
        <span class="text-dark/60 dark:text-light/60">{$t('Social').toLowerCase()}</span>
        <span
          class="cursor-default select-none text-dark/60 dark:text-light/60"
          aria-hidden="true">/</span
        >
        <div
          class="flex flex-row items-center justify-between text-dark/90 dark:text-light/90"
          role="group"
          aria-label={$t('Social links')}
        >
          {#each socials as social, i}
            <Tooltip text={social.url} position="top">
              <BaseLink
                text={social.name}
                href={social.url}
                target={social.target}
                rel={social.rel}
              ></BaseLink>
            </Tooltip>
            {#if i < socials.length - 1}
              <span
                class="cursor-default select-none text-dark/60 dark:text-light/60"
                aria-hidden="true">,&nbsp;</span
              >
            {/if}
          {/each}
        </div>
      </div>
    {/if}
    {#if APP_VERSION?.length}
      <div
        class="flex select-none flex-row items-center justify-start gap-x-2 text-dark/90 dark:text-light/90"
        aria-label={$t('View latest commit on GitHub')}
      >
        <span class="text-dark/60 dark:text-light/60">git</span>
        <span
          class="cursor-default select-none text-dark/60 dark:text-light/60"
          aria-hidden="true">/</span
        >
        <Tooltip text={$t('View latest commit on GitHub')} position="top">
          <BaseLink
            target="_blank"
            rel="noopener noreferrer"
            href="{BASE_GIT_URL}/commit/{APP_VERSION}"
            aria-label={$t('View latest commit on GitHub')}
          >
            {APP_VERSION.slice(0, 6)}
          </BaseLink>
        </Tooltip>
      </div>
    {/if}
  </footer>
{/if}
