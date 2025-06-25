<script lang="ts">
  import type { NAV_LINKS } from '$lib/consts';
  import { t } from '$lib/i18n';

  export let link: (typeof NAV_LINKS)[number];

  const { title, description } = (() => {
    const title = $t(link.name);
    switch (link.url) {
      case '/':
        return {
          title,
          description: $t('pages.about.description')
        };
      case '/thoughts':
        return {
          title,
          description: $t('pages.thoughts.description')
        };
      case '/work':
        return {
          title,
          description: $t('pages.work.description')
        };
      case '/etc':
        return {
          title,
          description: $t('pages.etc.description')
        };
    }
  })();
</script>

<div
  class="text-light dark:text-dark pointer-events-none flex max-w-64 flex-col gap-1 rounded-lg bg-neutral-600 px-3 pt-2 pb-3 dark:bg-neutral-100"
>
  <span>
    <p class="font-sans text-base font-semibold">{title}</p>
  </span>
  <p class="font-sans text-sm text-wrap">{description}</p>
</div>
