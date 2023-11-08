<script lang="ts">
  import { fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION * 0.5;
</script>

{#key pathname}
  <div in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
    <slot />
  </div>
{/key}
