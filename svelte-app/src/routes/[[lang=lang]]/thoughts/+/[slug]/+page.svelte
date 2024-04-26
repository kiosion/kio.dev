<script lang="ts">
  export let data;
</script>

<!-- TODO: Tidy -->
<section class="mb-6 w-full transition-colors">
  <div class="mb-5 mt-6 flex w-full flex-col items-start justify-start gap-2 px-8">
    <h2 class="font-mono text-lg text-neutral-600 dark:text-neutral-300">Topic:</h2>
    <span class=" font-display text-3xl font-bold"
      >{data.slug?.slice(0, 1).toUpperCase()}{data.slug?.slice(1)}</span
    >
  </div>
</section>
