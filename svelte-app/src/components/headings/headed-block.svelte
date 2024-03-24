<script lang="ts">
  export let heading: string,
    testId: string | undefined = undefined;

  export const id = Math.random().toString(36).substring(2);
</script>

<section {id} class="transition-colors" data-test-id={testId}>
  <h1 id="{id}-heading" class="py-2 font-code text-2xl font-black">{heading}</h1>
  <div class="mx-1 font-sans text-base text-dark/90 dark:text-light/90">
    <slot {id} />
  </div>
</section>
