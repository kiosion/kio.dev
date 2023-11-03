<script lang="ts">
  import { navOpen } from '$stores/navigation';

  import Hoverable from '$components/hoverable.svelte';

  import Icon from '../icon.svelte';
</script>

<Hoverable>
  <button
    class="focusOutline -m-1.5 flex h-[32px] w-[32px] items-center justify-center rounded-sm hover:text-accent-light dark:hover:text-accent-dark {$$props.class ||
      ''}"
    aria-label="Toggle navigation"
    data-test-id="nav-toggle"
    on:click={() => navOpen.set(!$navOpen)}
  >
    {#if $navOpen}
      <Icon icon="BackBurger" height={24} width={24} />
    {:else}
      <Icon icon="ForwardBurger" height={24} width={24} />
    {/if}
  </button>
</Hoverable>
