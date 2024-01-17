<script lang="ts">
  import { quadIn, quadOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION * 0.65;
</script>

{#key pathname}
  <div
    in:scale={{ duration, delay: duration, easing: quadIn, start: 0.998 }}
    out:scale={{ duration, easing: quadOut, start: 0.992 }}
  >
    <slot />
  </div>
{/key}
