<script lang="ts">
  import { quadIn, quadOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let pathname: string | undefined;

  const duration = BASE_ANIMATION_DURATION * 0.8,
    amount = 0.95;
</script>

{#key pathname}
  <div
    in:blur={{ duration, delay: duration * 0.8, amount, easing: quadIn }}
    out:blur={{ duration: duration * 0.8, amount, easing: quadOut }}
  >
    <slot />
  </div>
{/key}
