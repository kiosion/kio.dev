<script lang="ts">
  import { fly } from 'svelte/transition';

  export let url = '';
</script>

{#key url}
  <div
    in:fly={{ delay: 100, duration: 200, y: -10 }}
    out:fly={{ duration: 100, y: 10 }}
    class="m-0 p-0"
  >
    <slot />
  </div>
{/key}
