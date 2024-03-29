<script lang="ts">
  import { BASE_GIT_URL } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import { t } from '$lib/i18n';

  import Divider from '$components/divider.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';
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

<Divider />

{#if socials?.length || APP_VERSION?.length}
  <footer
    class="flex flex-row items-center justify-between font-mono text-sm print:hidden"
  >
    {#if socials?.length}
      <Hoverable setPointer={false} let:hovered>
        <div class="flex select-none flex-row items-center justify-start gap-x-3">
          <Icon
            name="At"
            class={hovered
              ? 'text-accent-light/80 dark:text-accent-dark/80'
              : 'text-dark/90 dark:text-light/90'}
            size={20}
          />
          <div
            class="flex flex-row items-center justify-between gap-x-2 font-mono text-sm text-dark/90 dark:text-light/90"
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
                />
              </Tooltip>
              {#if i < socials.length - 1}
                <span class="cursor-default select-none" aria-hidden="true">/</span>
              {/if}
            {/each}
          </div>
        </div>
      </Hoverable>
    {/if}
    {#if APP_VERSION?.length}
      <Hoverable setPointer={false} let:hovered>
        <div
          class="flex select-none flex-row items-center justify-start gap-x-3 font-mono text-sm text-dark/90 dark:text-light/90"
          aria-label={$t('View latest commit on GitHub')}
        >
          <Icon
            name="GitBranch"
            class={hovered
              ? 'text-accent-light/80 dark:text-accent-dark/80'
              : 'text-dark/90 dark:text-light/90'}
            size={20}
          />
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
      </Hoverable>
    {/if}
  </footer>
{/if}
