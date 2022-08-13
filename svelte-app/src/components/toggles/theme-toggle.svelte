<script>
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';
</script>

<button
  class="w-fit h-fit text-xl hover:text-slate-600 dark:hover:text-slate-300"
  aria-label="Toggle theme"
  data-test-id="theme-toggle"
  on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
  ><Icon
    icon="akar-icons:{$theme === 'light' ? 'moon-fill' : 'sun-fill'}"
  /></button
>
