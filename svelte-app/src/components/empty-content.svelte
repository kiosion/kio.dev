<script lang="ts">
  import ExclamationCircle from '$components/icons/exclamation-circle.svelte';

  let { message = 'No content available.' }: { message?: string } = $props();
</script>

<div
  class="my-4 flex flex-col items-center justify-center gap-4 text-center text-base text-neutral-700 dark:text-neutral-300">
  <ExclamationCircle />
  <p>{message}</p>
</div>
