<script lang="ts">
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';

  export let heading: string | undefined = undefined,
    constrainWidth = true,
    testId: string | undefined = undefined;

  export const id = Math.random().toString(36).substring(2);
</script>

<section class="mb-5 w-full transition-colors md:mb-6" {id} data-test-id={testId}>
  <div class="mb-4 mt-5 w-full px-6 md:mb-5 md:mt-6 md:px-8">
    {#if $$slots.heading}
      <slot name="heading" {id} />
    {:else}
      <h1 class="font-display text-3xl font-black" id="{id}-heading">{heading}</h1>
    {/if}
  </div>
  {#if constrainWidth}
    <ConstrainWidth class="px-6 md:px-8">
      <div class="mx-1 font-sans text-base text-dark/90 dark:text-light/90">
        <slot {id} />
      </div>
    </ConstrainWidth>
  {:else}
    <div class="mx-1 font-sans text-base text-dark/90 dark:text-light/90">
      <slot {id} />
    </div>
  {/if}
</section>
