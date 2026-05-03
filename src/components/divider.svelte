<script lang="ts">
  export let margin: `my-${number}` = 'my-5';
</script>

<span
  class="block w-full border-t border-dashed border-neutral-300 dark:border-neutral-400 {margin} {$$props.class ||
    ''}"></span>
