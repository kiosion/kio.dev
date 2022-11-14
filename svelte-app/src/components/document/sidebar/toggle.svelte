<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import SafeIcon from '$components/icons/safe-icon.svelte';
  import { sidebarOpen } from '$stores/navigation';
  import SFX from '$lib/sfx';

  export let showText = false;
</script>

<Hoverable>
  <!-- <div
    class="sticky self-start w-0 top-12 xl:-translate-x-[4px] 2xl:translate-x-0"
  > -->
  <div>
    <button
      class="flex flex-row items-center justify-start gap-4 ml-1 text-base font-code"
      aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      on:click={() => {
        SFX.click.play();
        sidebarOpen.set(!$sidebarOpen);
      }}
      on:keydown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          SFX.click.play();
          sidebarOpen.set(!$sidebarOpen);
        }
      }}
    >
      <SafeIcon icon={$sidebarOpen ? 'BookOpen' : 'Book'} />
      {#if showText}
        <p class="-ml-1 mb-0.5">{$sidebarOpen ? 'Hide' : 'Show'}</p>
      {:else}
        <slot />
      {/if}
    </button>
  </div>
</Hoverable>
