<script lang="ts">
  import { t } from '$i18n';

  export let wide = false;
</script>

<div aria-label={$t('Page content')} id="content-wrapper" class:wide>
  <slot />
</div>

<style lang="scss">
  @import '@styles/mixins';

  div {
    @apply mx-auto mb-8 w-full max-w-none px-2 pb-12 transition-[transform];

    @include media(lg) {
      max-width: 40rem;
    }
    @include media(xl) {
      max-width: 48rem;
    }
    @include media(2xl) {
      max-width: 52rem;
    }

    &.wide {
      @include media(lg) {
        max-width: 48rem;
      }
      @include media(xl) {
        max-width: 56rem;
      }
      @include media(2xl) {
        max-width: 64rem;
      }
    }
  }
</style>
