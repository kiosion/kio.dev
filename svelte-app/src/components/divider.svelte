<script lang="ts">
  export let classes = '',
    accent = false;
</script>

<span
  class="block my-6 h-[1px] w-full {accent
    ? 'bg-violet-500'
    : 'bg-stone-400 dark:bg-stone-400/40'} {classes}"
/>
