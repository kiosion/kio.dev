<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let text = 'Unknown error';
  export let classes = '';
</script>

<div
  data-test-id="error-text"
  class="flex flex-row items-center justify-center {classes}"
>
  <Icon icon="Alert" />
  <p class="font-code text-lg ml-3">{text}</p>
</div>
