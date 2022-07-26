<script lang="ts">
  import Icon from '@iconify/svelte';
  import { menuOpen } from '@/stores/menu';
</script>

<button
  class="relative text-2xl hover:text-slate-600 dark:hover:text-slate-300"
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
