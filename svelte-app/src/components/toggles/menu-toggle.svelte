<script lang="ts">
  import { menuOpen } from '@/stores/menu';
  import { fade } from 'svelte/transition';
  import Menu from 'pixelarticons/svg/menu.svg';
  import CloseBox from 'pixelarticons/svg/close-box.svg';
</script>

<button
  class="relative w-6 h-6 text-2xl hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
  aria-label="Toggle nav"
  on:click={() => menuOpen.set(!$menuOpen)}
>
  {#if $menuOpen}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <CloseBox width="20" />
    </span>
  {:else}
    <span
      class="absolute bottom-0 left-0"
      in:fade={{ delay: 100, duration: 200 }}
      out:fade={{ duration: 100 }}
    >
      <Menu width="20" />
    </span>
  {/if}
</button>
