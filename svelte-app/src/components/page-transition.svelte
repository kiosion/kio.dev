<script lang="ts">
  import { fade } from 'svelte/transition';

  // in:fly={{ delay: 100, duration: 200, y: -10 }}
  // out:fly={{ duration: 100, y: 10 }}

  export let url: string;
</script>

{#key url}
  <div
    in:fade={{ delay: 100, duration: 200 }}
    out:fade={{ duration: 100 }}
    class="m-0 p-0 h-full w-full"
  >
    <slot />
  </div>
{/key}
