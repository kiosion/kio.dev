<script lang="ts">
  export let margin: `my-${number}` = 'my-5';
</script>

<span
  class="block h-px w-full bg-dark/80 transition-[background-color] duration-75 dark:bg-light/60 {margin} {$$props.class ||
    ''}"
></span>
