<script lang="ts">
  import Icon from '@iconify/svelte';
  import { theme } from '@/stores/theme';
  import { fade } from 'svelte/transition';
</script>

<button
  class="w-fit h-fit text-xl hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
  aria-label="Toggle theme"
  data-test-id="theme-toggle"
  on:click={() => theme.set($theme === 'light' ? 'dark' : 'light')}
>
  {#key $theme}
    <div in:fade={{ delay: 100, duration: 200 }} out:fade={{ duration: 100 }}>
      <Icon icon="akar-icons:{$theme === 'light' ? 'moon-fill' : 'sun-fill'}" />
    </div>
  {/key}
</button>
