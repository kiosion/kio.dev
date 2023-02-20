<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let text: string,
    icon: string,
    classNames = 'mt-8 mb-2 w-full h-fit';
</script>

<div
  class="flex select-none flex-row items-center justify-start gap-3 {classNames}"
>
  <Icon {icon} />
  <h3 class="font-code text-lg font-bold">{text}</h3>
</div>
