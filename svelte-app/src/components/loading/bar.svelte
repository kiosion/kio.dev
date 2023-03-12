<script lang="ts">
  import Line from './animations/line.svelte';

  export let width = '100vw',
    height = '2px',
    classes = '';
</script>

<Line {width} {height} {classes} />
