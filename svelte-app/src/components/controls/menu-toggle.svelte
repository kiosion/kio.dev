<script lang="ts">
  import SFX from '$lib/sfx';
  import { navOpen } from '$stores/navigation';

  import Hoverable from '$components/hoverable.svelte';

  import Icon from '../icon.svelte';
</script>

<Hoverable>
  <button
    class="focusOutline h-[20px] w-[20px] rounded-sm hover:text-violet-400 dark:hover:text-violet-300"
    aria-label="Toggle navigation"
    data-test-id="nav-toggle"
    on:click={() => {
      navOpen.set(!$navOpen);
      SFX.click.play();
    }}
  >
    {#if $navOpen}
      <Icon icon="CloseBox" />
    {:else}
      <Icon icon="Menu" />
    {/if}
  </button>
</Hoverable>
