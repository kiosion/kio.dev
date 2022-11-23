<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let text: string;
  export let icon: string;
  export let classes = 'mt-8 mb-2 w-full h-fit';
</script>

<div
  class="flex flex-row justify-start items-center gap-3 select-none {classes}"
>
  <Icon {icon} />
  <h3 class="font-code text-lg">{text}</h3>
</div>
