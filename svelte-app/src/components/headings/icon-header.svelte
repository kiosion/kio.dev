<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let text: string, icon: string;
</script>

<div class={$$props.class || 'mb-2 mt-8 h-fit w-full'}>
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
