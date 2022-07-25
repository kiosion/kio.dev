<script>
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';
</script>

<button
  class="relative text-xl hover:text-slate-600 dark:hover:text-slate-300"
  aria-label="Toggle theme"
  on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
>
  {#if $theme === 'light'}
    <span class="absolute bottom-0 right-0">
      <Icon icon="akar-icons:moon-fill" />
    </span>
  {:else}
    <span class="absolute bottom-0 right-0">
      <Icon icon="akar-icons:sun-fill" />
    </span>
  {/if}
</button>
