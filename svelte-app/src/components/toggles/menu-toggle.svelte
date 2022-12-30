<script lang="ts">
  import { navOpen } from '$stores/navigation';
  import Icon from '../icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
</script>

<Hoverable>
  <button
    class="w-[20px] h-[20px] hover:text-violet-400 dark:hover:text-violet-300 rounded-sm focusOutline"
    aria-label="Toggle navigation"
    data-test-id="nav-toggle"
    on:click={() => {
      navOpen.set(!$navOpen);
      SFX.click.play();
    }}
  >
    {#if $navOpen}
      <Icon icon={'CloseBox'} classes="transition-none!" />
    {:else}
      <Icon icon={'Menu'} classes="transition-none!" />
    {/if}
  </button>
</Hoverable>
