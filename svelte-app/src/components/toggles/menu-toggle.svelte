<script lang="ts">
  import Icon from '@iconify/svelte';
  import { menuOpen } from '@/stores/menu';
</script>

<button
  class="relative text-2xl hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
  aria-label="Toggle nav"
  on:click={() => menuOpen.set(!$menuOpen)}
>
  {#if $menuOpen}
    <span class="absolute bottom-0 left-0">
      <Icon icon="eva:close-fill" />
    </span>
  {:else}
    <span class="absolute bottom-0 left-0">
      <Icon icon="eva:menu-fill" />
    </span>
  {/if}
</button>
