<script lang="ts">
  import Icon from '@iconify/svelte';

  export let text = 'Unknown error';
  export let classes = '';
</script>

<div class="flex flex-row items-center justify-center {classes}">
  <Icon icon="clarity:error-standard-solid" />
  <p class="font-code text-lg ml-3">{text}</p>
</div>
