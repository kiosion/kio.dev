<script lang="ts">
  import { navOpen } from '$stores/navigation';
  import Icon from '../icon.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import SFX from '$lib/sfx';
</script>

<Hoverable>
  <button
    class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400"
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
