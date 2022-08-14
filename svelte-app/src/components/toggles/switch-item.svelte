<script lang="ts">
  import Switch from './switch.svelte';

  /* eslint-disable-next-line */
  export let action = (event: CustomEvent, target: any) => undefined;
  export let target = {};
  export let label = '';
  export let state = false;
  export let disabled = false;
</script>

<div
  class="flex flex-row w-full justify-start gap-2 mt-4 {disabled
    ? 'cursor-not-allowed'
    : ''}"
>
  <Switch on:change={(event) => action(event, target)} {state} {disabled} />
  <p>{label}</p>
</div>
