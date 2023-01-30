<script lang="ts">
  import Icon from '$components/icon.svelte';

  export let heading: string,
    text = '',
    icon = 'ArrowRight',
    classNames = '';
</script>

<div class="mt-4 ml-4 mb-8 {classNames}">
  <h1 class="font-display text-8xl mb-3">{heading}</h1>
  {#if text}
    <span class="flex flex-row gap-2 items-start ml-4">
      <Icon {icon} classNames="mt-0.5" />
      <p class="font-code text-base">{text}</p>
    </span>
  {/if}
  <slot />
</div>
