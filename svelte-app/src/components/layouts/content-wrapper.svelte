<script lang="ts">
  export let classNames = '',
    fixed = false,
    wide = false;
</script>

{#if fixed}
  <div class="w-full {wide ? 'max-w-[64rem]' : 'max-w-[42rem]'} pb-20 {classNames}">
    <slot />
  </div>
{:else}
  <div
    class="mx-auto mb-8 w-full max-w-none px-2 pb-12 transition-[transform] md:w-[38rem] md:max-w-none xl:w-[46rem] 2xl:w-[52rem] {classNames}"
  >
    <slot />
  </div>
{/if}
