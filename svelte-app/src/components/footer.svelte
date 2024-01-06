<script lang="ts">
  import { t } from '$i18n';
  import { APP_VERSION } from '$lib/env';

  import Divider from '$components/divider.svelte';
  import Icon from '$components/icon.svelte';
  import Tooltip from '$components/tooltip.svelte';

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
  <Divider />
  <div>
    {#if socials?.length}
      <div class="socials">
        {#each socials as social, i}
          <Tooltip text={social.url} delay={750} position="top" fixed>
            <a target={social.target} rel={social.rel} href={social.url}>
              {social.name}
            </a>
          </Tooltip>
          {#if i < socials.length - 1}
            <span aria-hidden="true">/</span>
          {/if}
        {/each}
      </div>
    {/if}
    {#if APP_VERSION?.length}
      <div class="version">
        <Tooltip
          text={$t('View latest commit on GitHub')}
          position="top"
          delay={750}
          fixed
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kiosion/kio.dev/commit/{APP_VERSION}"
            aria-label={$t('View latest commit on GitHub')}
          >
            <Icon icon="GitCommit" inline />
            {APP_VERSION.slice(0, 6)}
          </a>
        </Tooltip>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply flex flex-row items-center justify-between font-mono text-sm;
  }

  span {
    @apply cursor-default select-none;
  }

  .socials {
    @apply flex flex-1 flex-row items-center justify-start gap-2 text-dark/90;
  }

  a {
    @apply rounded-sm text-dark/80;

    &:hover,
    &:focus-visible {
      @apply text-accent-light;
    }

    @include focus-state(sm);
  }

  .version {
    a {
      @apply flex flex-1 flex-row items-center justify-end gap-2;
    }
  }

  :global(.dark) {
    .socials {
      @apply text-light/90;
    }

    a {
      @apply text-light/80;

      &:hover,
      &:focus-visible {
        @apply text-accent-dark;
      }

      @include focus-state(sm, dark);
    }
  }
</style>
