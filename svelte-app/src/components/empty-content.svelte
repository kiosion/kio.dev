<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';

  export let text = 'Hm, it seems empty around here...',
    classNames = 'my-8';
</script>

<div class={classNames} data-test-id="error-text">
  <IconHeader icon={'Downasaur'} {text} />
</div>
