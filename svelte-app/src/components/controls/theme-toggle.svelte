<script lang="ts">
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { APP_THEMES, BASE_ANIMATION_DURATION } from '$lib/consts';
  import { t } from '$lib/i18n';
  import Settings from '$lib/settings';

  import Hoverable from '$components/hoverable.svelte';

  const ANIM_DURATION = BASE_ANIMATION_DURATION * 1.25,
    blurInOpts = {
      duration: ANIM_DURATION,
      amount: 8,
      easing: cubicOut,
      delay: ANIM_DURATION * 0.5
    },
    blurOutOpts = {
      duration: ANIM_DURATION,
      amount: 8,
      easing: cubicIn
    };

  const { theme, modified } = Settings;
</script>

<Hoverable let:hovered>
  <button
    class="flex-1 rounded-lg bg-neutral-0/75 px-2.5 py-2 text-sm transition-all hover:bg-neutral-0 focus-visible:bg-neutral-0 dark:bg-neutral-800/75 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
    aria-label={$t(`Use ${$theme === APP_THEMES.LIGHT ? 'dark' : 'light'} mode`)}
    data-test-id="theme-toggle"
    tabindex="0"
    on:click={(e) => {
      modified.set(true);
      theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
    }}
    on:keyup={(e) => {
      if (e.key !== 'Enter') {
        return;
      }

      modified.set(true);
      theme.set($theme === APP_THEMES.LIGHT ? APP_THEMES.DARK : APP_THEMES.LIGHT);
    }}
    type="button"
  >
    {#if hovered}
      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        {#if $theme === APP_THEMES.LIGHT}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z"
            />
          </svg>
          <span>{$t('Dark')}</span>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.173 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"
            />
          </svg>
          <span>{$t('Light')}</span>
        {/if}
      </div>
    {:else}
      <div
        class="mx-auto flex h-fit flex-row items-center justify-start gap-2"
        in:blur={blurInOpts}
        out:blur={blurOutOpts}
      >
        {#if $theme === APP_THEMES.LIGHT}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.173 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"
            />
          </svg>
          <span>{$t('Light')}</span>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z"
            />
          </svg>
          <span>{$t('Dark')}</span>
        {/if}
      </div>
    {/if}
  </button>
</Hoverable>

<style lang="scss">
  button {
    display: grid;
  }

  div {
    grid-column: 1/2;
    grid-row: 1/2;
  }
</style>
