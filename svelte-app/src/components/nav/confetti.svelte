<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import ConfettiPiece from '$components/nav/confetti-piece.svelte';

  const dispatch = createEventDispatcher<{ done: void }>();

  onMount(() => setTimeout(() => dispatch('done'), 1500));
</script>

<div
  class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
  aria-hidden="true"
>
  {#each Array.from({ length: 30 }) as _, index (index)}
    <ConfettiPiece {index} />
  {/each}
</div>
