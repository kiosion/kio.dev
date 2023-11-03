<script lang="ts">
  import { fade } from 'svelte/transition';

  import { BASE_ANIMATION_DURATION } from '$lib/consts';

  export let pathname: string | undefined;
</script>

<!-- TODO: This method is broken (& has been for a while), see https://github.com/sveltejs/svelte/issues/6152 -->
<!-- For now, the alternative is to not use a Key block, and simply import this component -->
<!-- in each individual subroute... which is Not happening, lol -->
{#key pathname}
  <div
    in:fade={{
      duration: BASE_ANIMATION_DURATION * 0.5,
      delay: BASE_ANIMATION_DURATION * 0.5
    }}
    out:fade={{ duration: BASE_ANIMATION_DURATION * 0.5 }}
  >
    <slot />
  </div>
{/key}
