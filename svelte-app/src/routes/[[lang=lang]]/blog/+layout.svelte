<script lang="ts">
  import Icon from '$components/icon.svelte';
  import { t } from '$i18n';
</script>

<div data-test-route="blog" class="mt-8 w-full max-w-[64rem] pb-20">
  <!-- <span
    class="flex flex-row gap-2 text-base text-slate-700 dark:text-slate-200"
  >
    <Icon icon="ChevronRight" classNames="mt-0.5" />
    <p>
      {t('Thoughts and guides on tech, design, and development things')}
    </p>
  </span> -->
  <slot />
</div>
