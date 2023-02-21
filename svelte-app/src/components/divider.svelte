<script lang="ts">
  export let classes = '',
    accent = false;
</script>

<span
  class="my-6 block h-[1px] w-full {accent
    ? 'bg-violet-500'
    : 'bg-stone-400 dark:bg-stone-500/60'} {classes}"
/>
