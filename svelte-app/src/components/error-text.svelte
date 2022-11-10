<script lang="ts">
  import SafeIcon from '$components/icons/safe-icon.svelte';

  export let text = 'Unknown error';
  export let classes = '';
</script>

<div
  data-test-id="error-text"
  class="flex flex-row items-center justify-center {classes}"
>
  <SafeIcon icon="Alert" />
  <p class="font-code text-lg ml-3">{text}</p>
</div>
