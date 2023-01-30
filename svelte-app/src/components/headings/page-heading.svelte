<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let heading: string,
    text = '',
    icon = 'ArrowRight',
    classNames = '';
</script>

<div class={classNames}>
  <h1>{heading}</h1>
  {#if text}
    <span>
      <Icon {icon} classNames="mt-0.5" />
      <p>{text}</p>
    </span>
  {/if}
  <slot />
</div>

<style lang="scss">
  div {
    @apply mt-4 ml-4 mb-8;
    h1 {
      @apply mb-3 font-display text-8xl;
    }

    span {
      @apply ml-4 flex flex-row items-start gap-2;

      p {
        @apply font-code text-base;
      }
    }
  }
</style>
