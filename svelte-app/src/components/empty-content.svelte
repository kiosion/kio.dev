<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';

  export let text = 'Hm, it seems empty around here...';
</script>

<div class="my-8" data-test-id="error-text">
  <IconHeader icon={'Downasaur'} {text} />
</div>
