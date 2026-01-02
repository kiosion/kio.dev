<script lang="ts">
  import { BASE_GIT_URL } from '$lib/consts';
  import { APP_VERSION } from '$lib/env';
  import type { GetConfigQueryResult } from '$types/generated/sanity.types';

  const { config }: { config: NonNullable<GetConfigQueryResult> } = $props();
</script>

<footer
  class="bg-light dark:bg-dark flex w-full flex-row items-center justify-between gap-x-8 border-t border-neutral-300 dark:border-neutral-400"
>
  <div class="py-6 pl-8 text-sm">
    <p>&copy; {new Date().getFullYear()} {config.name}</p>
  </div>
  {#if config.email || APP_VERSION?.length}
    <div class="flex flex-row items-center justify-end gap-4 py-6 pr-8 text-sm">
      {#if config.email}
        <a
          class="hover:decoration-orange-light hover:dark:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-colors dark:decoration-neutral-400"
          href={`${config.email}`}>{config.email.split('mailto:')[1]}</a
        >
        {#if APP_VERSION?.length}
          <span class="opacity-50 select-none">|</span>
        {/if}
      {/if}
      {#if APP_VERSION?.length}
        <a
          class="hover:decoration-orange-light hover:dark:decoration-orange-dark underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-colors dark:decoration-neutral-400"
          target="_blank"
          rel="noopener noreferrer"
          href={`${BASE_GIT_URL}/commit/${APP_VERSION}`}>#{APP_VERSION.slice(0, 6)}</a
        >
      {/if}
    </div>
  {/if}
</footer>
