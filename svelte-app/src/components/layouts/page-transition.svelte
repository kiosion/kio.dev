<script lang="ts">
  import { quadIn, quadOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION * 0.75;
</script>

{#key pathname}
  <div
    in:scale={{ duration, delay: duration, easing: quadIn, start: 0.995 }}
    out:scale={{ duration, easing: quadOut, start: 0.995 }}
  >
    <slot />
  </div>
{/key}
