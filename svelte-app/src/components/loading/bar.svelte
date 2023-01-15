<script lang="ts">
  import Line from './animations/line.svelte';

  export let width = '100vw',
    height = '2px',
    segments = 15,
    classes = '';
</script>

<Line {width} {height} {segments} {classes} />
