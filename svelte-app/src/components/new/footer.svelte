<script lang="ts">
  import { BASE_GIT_URL } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import type { GetConfigQueryResult } from '$types/generated/sanity.types';

  const { config }: { config: NonNullable<GetConfigQueryResult> } = $props();
</script>

<footer
  class="bg-light dark:bg-dark flex w-full flex-col items-center justify-center gap-x-8 gap-y-6 border-t border-neutral-300 px-8 py-6 transition-colors sm:flex-row sm:justify-between dark:border-neutral-400"
>
  <div class="text-sm">
    <p>&copy; {new Date().getFullYear()} {config.name}</p>
  </div>
  {#if config.socialLinks?.length || APP_VERSION?.length}
    <div class="flex flex-row items-center justify-end gap-4 text-sm">
      {#if config.socialLinks?.length}
        {#each config.socialLinks as link, idx}
          <a
            class="hover:decoration-orange-light hover:dark:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] dark:decoration-neutral-400"
            href={link.url}
            rel="noopener noreferrer"
            target="_blank">{link.name}</a
          >
          {#if idx < config.socialLinks.length - 1}
            <span class="opacity-50 select-none">|</span>
          {/if}
        {/each}
      {/if}
      {#if config.socialLinks?.length && APP_VERSION?.length}
        <span class="opacity-50 select-none">|</span>
      {/if}
      {#if APP_VERSION?.length}
        <a
          class="hover:decoration-orange-light hover:dark:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] dark:decoration-neutral-400"
          target="_blank"
          rel="noopener noreferrer"
          href={`${BASE_GIT_URL}/commit/${APP_VERSION}`}>#{APP_VERSION.slice(0, 6)}</a
        >
      {/if}
    </div>
  {/if}
</footer>
