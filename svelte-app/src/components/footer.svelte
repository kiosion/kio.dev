<script lang="ts">
  import { APP_VERSION } from '$lib/env';
  import { t } from '$lib/i18n';

  import Divider from '$components/divider.svelte';
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
  <footer>
    {#if socials?.length}
      <div>
        {#each socials as social, i}
          <Tooltip text={social.url} delay={300} position="top">
            <BaseLink
              text={social.name}
              href={social.url}
              target={social.target}
              rel={social.rel}
              noTranslate
            />
          </Tooltip>
          {#if i < socials.length - 1}
            <span aria-hidden="true">/</span>
          {/if}
        {/each}
      </div>
    {/if}
    {#if APP_VERSION?.length}
      <div>
        <Tooltip text={$t('View latest commit on GitHub')} position="top">
          <BaseLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kiosion/kio.dev/commit/{APP_VERSION}"
            aria-label={$t('View latest commit on GitHub')}
          >
            <Icon name="GitCommit" inline />
            {APP_VERSION.slice(0, 6)}
          </BaseLink>
        </Tooltip>
      </div>
    {/if}
  </footer>
{/if}

<style lang="scss">
  @import '@styles/mixins';

  footer {
    @apply flex flex-row items-center justify-between font-mono text-sm;
  }

  div {
    @apply flex flex-row items-center justify-between gap-x-2 font-mono text-sm text-dark/90;

    @include dark {
      @apply text-light/90;
    }
  }

  span {
    @apply cursor-default select-none;
  }
</style>
