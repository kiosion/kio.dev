<script lang="ts">
  export let wide = false;
</script>

<div
  class="mx-auto mb-8 w-full max-w-none px-2 pb-12 transition-[transform] {wide
    ? 'lg:max-w-[48rem] xl:max-w-[56rem] 2xl:max-w-[64rem]'
    : 'lg:max-w-[38rem] xl:max-w-[46rem] 2xl:max-w-[52rem]'}"
>
  <slot />
</div>
