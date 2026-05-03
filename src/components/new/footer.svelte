<script lang="ts">
  import Link from '$components/link.svelte';
  import { BASE_GIT_URL } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import type { SiteConfig } from '$lib/site-config';

  const { config }: { config: SiteConfig } = $props();
</script>

<footer
  class="bg-light dark:bg-dark w-full border-t border-neutral-200 text-neutral-400 opacity-75 transition-[color,background-color,opacity] focus-within:opacity-100 hover:opacity-100 dark:border-neutral-400 dark:text-neutral-200">
  <div
    class="mx-auto flex max-w-6xl flex-col items-center justify-center gap-x-8 gap-y-6 px-8 py-6 sm:flex-row sm:justify-between">
    <div class="text-sm">
      <p>&copy; {new Date().getFullYear()} {config.name}</p>
    </div>
    {#if config.social?.length || APP_VERSION?.length}
      <div class="flex flex-row items-center justify-end gap-4 text-sm">
        {#if config.social?.length}
          {#each config.social as link, idx (link.url)}
            <Link href={link.url} target="_blank" rel="noopener noreferrer"
              >{link.name}</Link>
            {#if idx < config.social.length - 1}
              <span class="opacity-50 select-none">|</span>
            {/if}
          {/each}
        {/if}
        {#if config.social?.length && APP_VERSION?.length}
          <span class="opacity-50 select-none">|</span>
        {/if}
        {#if APP_VERSION?.length}
          <Link
            href={`${BASE_GIT_URL}/commit/${APP_VERSION}`}
            target="_blank"
            rel="noopener noreferrer">#{APP_VERSION.slice(0, 6)}</Link>
        {/if}
      </div>
    {/if}
  </div>
</footer>
