<script lang="ts">
  export let classes = '',
    accent = false;
</script>

<span
  class="my-6 block h-[1px] w-full {accent
    ? 'bg-accent-light dark:bg-accent-dark'
    : 'bg-dark/40 dark:bg-light/40'} {classes}"
/>
