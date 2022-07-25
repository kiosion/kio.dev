<script>
  import { theme } from '@/stores/theme';
</script>

<button
  class="font-mono font-normal text-sm uppercase hover:font-bold"
  aria-label="Toggle theme"
  on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
>{$theme === 'light' ? 'lights off' : 'lights on'}</button>
