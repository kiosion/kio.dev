<script lang="ts">
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';

  export let heading: string,
    testId: string | undefined = undefined;

  export const id = Math.random().toString(36).substring(2);
</script>

<section class="w-full transition-colors" {id} data-test-id={testId}>
  <div class="my-5 w-full px-8">
    <h1 class="font-code text-2xl font-black" id="{id}-heading">{heading}</h1>
  </div>
  <ConstrainWidth class="px-8">
    <div class="mx-1 font-sans text-base text-dark/90 dark:text-light/90">
      <slot {id} />
    </div>
  </ConstrainWidth>
</section>
