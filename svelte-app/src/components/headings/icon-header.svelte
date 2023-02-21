<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let text: string,
    icon: string,
    classNames = 'mt-8 mb-2 w-full h-fit';
</script>

<div class={classNames}>
  <Icon {icon} />
  <h3>{text}</h3>
</div>

<style lang="scss">
  div {
    @apply flex select-none flex-row items-center justify-start gap-3;

    h3 {
      @apply font-code text-lg font-bold;
    }
  }
</style>
