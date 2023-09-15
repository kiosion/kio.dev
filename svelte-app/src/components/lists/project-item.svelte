<script lang="ts">
  import { goto } from '$app/navigation';
  import { formatDate } from '$helpers/date';
  import { currentLang, linkTo, t } from '$i18n';
  import { LANGUAGE_COLOURS } from '$lib/consts';

  import BulletPoint from '$components/bullet-point.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';

  import type { ProjectDocument } from '$types';

  export let project: ProjectDocument;

  let hovered = false;

  const onClick = (e: MouseEvent | KeyboardEvent) => {
      e.preventDefault();
      external
        ? window.open(link, '_blank')
        : goto($linkTo(`/work/${project.slug.current}`)).catch(() => undefined);
    },
    onKey = (e: KeyboardEvent) => e.code === 'Enter' && onClick(e);

  $: date = formatDate(project.date, 'med', $currentLang);
  $: external = project.external;
  $: link = (() => {
    return external && project.externalUrl
      ? project.externalUrl
      : $linkTo(`/work/${project.slug.current}`);
  })();
</script>

<Hoverable bind:hovered>
  <button
    class="relative flex w-full flex-col items-stretch justify-start gap-y-1.5 rounded-xl px-6 py-5 lg:w-[calc(50%_-_12px)] 3xl:w-[calc(50%_-_12px)] {hovered
      ? 'border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-dark/40'
      : 'border-dark/40 bg-dark/5 dark:border-light/40 dark:bg-dark/20'} focusOutline -ml-[1px] -mt-[1px] border transition-[background-color,border-color]"
    data-test-id="list-item"
    tabindex="0"
    aria-label="{$t('Project')} - {project.title}"
    data-sveltekit-preload-code
    data-sveltekit-preload-data
    on:click={onClick}
    on:keydown={onKey}
  >
    <div class="mb-0.5 flex w-full flex-row items-center gap-x-3">
      <Icon
        class="-ml-0.5 text-dark dark:text-light {project.external ? 'mb-0.5' : ''}"
        icon={project.external ? 'open' : 'book-open'}
        width={20}
      />
      <h1
        class="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-left font-display text-xl font-bold decoration-[2px] underline-offset-[3px] {hovered
          ? 'underline'
          : ''}"
      >
        {project.title}
      </h1>
    </div>
    <div class="">
      {#if project.desc}
        <p
          class="line-clamp-2 w-full overflow-hidden text-ellipsis pr-6 text-left font-sans text-base"
        >
          {project.desc}
        </p>
      {/if}
    </div>
    <div class="mt-2 flex w-full flex-row flex-wrap items-center gap-y-2">
      {#if project.language}
        <div
          class="text-gray-700 dark:text-gray-200 flex flex-row items-center gap-x-2 font-sans text-sm"
        >
          <span
            class="relative mb-[1.5px] block h-3 w-3 rounded-full opacity-90 bg-[{LANGUAGE_COLOURS.get(
              project.language.toLowerCase()
            )}] -m-[0.5px] border-[0.5px] border-dark dark:border-light"
            style="background: {LANGUAGE_COLOURS.get(project.language.toLowerCase())}"
            >&nbsp;</span
          >
          <span>{project.language}</span>
        </div>
        <span class="mb-[1px]"><BulletPoint /></span>
      {/if}
      <p class="text-gray-700 dark:text-gray-200 font-sans text-sm">
        {date}
      </p>
    </div>
  </button>
</Hoverable>
