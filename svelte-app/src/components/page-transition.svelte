<script lang="ts">
  import { fly } from 'svelte/transition';
  import { reduceMotion } from '@/stores/features';

  export let url: URL;
</script>

{#key url}
  {#if $reduceMotion === 'on'}
    <div class="m-0 p-0">
      <slot />
    </div>
  {:else}
    <div
      in:fly={{ delay: 200, duration: 400, y: -20 }}
      out:fly={{ duration: 200, y: 20 }}
    >
      <slot />
    </div>
  {/if}
{/key}
