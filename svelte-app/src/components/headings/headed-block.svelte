<script lang="ts">
  import ConstrainWidth from '$components/layouts/constrain-width.svelte';

  export let heading: string | undefined = undefined,
    first = false,
    constrainWidth = true,
    testId: string | undefined = undefined;

  export const id = Math.random().toString(36).substring(2);
</script>

<section class="w-full pb-5 transition-colors md:pb-6" {id} data-test-id={testId}>
  <div
    class="mb-4 w-full px-6 md:mb-5 md:px-8"
    class:mt-5={!first}
    class:md:mt-6={!first}
    class:pt-5={first}
    class:md:pt-6={first}
  >
    {#if $$slots.heading}
      <slot name="heading" {id} />
    {:else}
      <h1 class="font-display text-3xl font-black" id="{id}-heading">{heading}</h1>
    {/if}
  </div>
  {#if constrainWidth}
    <ConstrainWidth class="px-6 md:px-8">
      <div class="text-dark/90 dark:text-light/90 mx-1 font-sans text-base">
        <slot {id} />
      </div>
    </ConstrainWidth>
  {:else}
    <div class="text-dark/90 dark:text-light/90 mx-1 font-sans text-base">
      <slot {id} />
    </div>
  {/if}
</section>
