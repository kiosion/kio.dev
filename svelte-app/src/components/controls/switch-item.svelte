<script lang="ts">
  import Switch from './switch.svelte';

  /* eslint-disable-next-line */
  export let action: (event: CustomEvent, target: any) => void;
  export let target = {};
  export let label = '';
  export let state = false;
  export let disabled = false;
</script>

<div
  class="mt-3 flex w-full flex-row items-center justify-start gap-2 {disabled
    ? 'cursor-not-allowed'
    : ''}"
>
  <Switch on:change={(event) => action(event, target)} {state} {disabled} />
  <p class="font-sans text-base ">{label}</p>
</div>
