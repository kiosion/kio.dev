<script lang="ts">
  import Line from './animations/line.svelte';
  import { fade } from 'svelte/transition';

  export let classes = '';
  export let width = '200px';
  export let height = '4px';
</script>

<div
  class="{classes} w-full h-fit"
  data-test-id="loader-inline"
  out:fade={{ duration: 200, delay: 200 }}
>
  <Line {width} {height} />
</div>
