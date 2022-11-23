<script lang="ts">
  import { navOpen } from '$stores/navigation';
  import Icon from '../icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-150"
    aria-label="Toggle navigation"
    data-test-id="nav-toggle"
    on:click={() => {
      navOpen.set(!$navOpen);
      SFX.click.play();
    }}
  >
    {#if $navOpen}
      <Icon icon={'CloseBox'} />
    {:else}
      <Icon icon={'Menu'} />
    {/if}
  </button>
</Hoverable>
