<script lang="ts">
  import FionaPlaceholder from '$components/fiona-placeholder.svelte';
  import { fly } from 'svelte/transition';
  import { quartOut } from 'svelte/easing';

  export let classNames = '',
    width: number,
    height: number,
    seed: string | undefined = undefined,
    delayOffset = 0;
</script>

<div
  class="absolute select-none overflow-hidden rounded-xl border border-stone-400 dark:border-stone-400/40 shadow-2xl dark:shadow-stone-900/20 {classNames}"
  in:fly={{ y: 50, duration: 1400, delay: 150 + delayOffset, easing: quartOut }}
>
  <FionaPlaceholder {width} {height} {seed} />
</div>
