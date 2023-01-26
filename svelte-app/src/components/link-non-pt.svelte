<script lang="ts">
  import Hoverable from '$components/hoverable.svelte';
  import { linkTo } from '$i18n';

  export let href: string,
    external = false,
    target: string | undefined = undefined;

  let hovered: boolean;
</script>

<Hoverable bind:hovered>
  <a
    href={linkTo(href)}
    {target}
    rel={external ? 'noopener noreferrer' : undefined}
    class="underlined from-violet-300 {hovered
      ? 'active dark:text-stone-800'
      : ''} rounded-sm focusOutline-sm px-[2px] -mx[2px]"
    tabindex="0"
  >
    <slot />
  </a>
</Hoverable>

<style lang="scss">
  .underlined {
    text-decoration: none;
    background-image: linear-gradient(
      to right,
      var(--tw-gradient-from) 0%,
      var(--tw-gradient-from) 100%
    );
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease;
    &.active {
      background-size: calc(100% - 4px) 100%;
    }
  }
</style>
