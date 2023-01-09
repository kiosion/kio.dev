<script lang="ts">
  import type { ProjectDocument } from '$types';
  import { goto } from '$app/navigation';
  import BulletPoint from '../bullet-point.svelte';
  import { getShortDate } from '$helpers/date';
  import Hoverable from '$components/hoverable.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';
  import { LANGUAGE_COLOURS } from '$lib/consts';
  import Icon from '$components/icon.svelte';

  export let project: ProjectDocument;

  let hovered = false;
  let self: HTMLAnchorElement;

  const onClick = (e?: MouseEvent) => {
    SFX.click.play();

    if (!e || e.target === self) {
      e?.preventDefault();
      if (external) {
        window.open(link, '_blank');
      } else {
        goto(linkTo(`/work/${project.slug.current}`)).catch(() => undefined);
      }
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      onClick();
    }
  };

  $: date = getShortDate(project.date);
  $: external = project.external;
  $: link = (() => {
    return external && project.externalUrl
      ? project.externalUrl
      : linkTo(`/work/${project.slug.current}`);
  })();
</script>

<Hoverable bind:hovered>
  <a
    class="relative flex flex-col items-stretch justify-start gap-y-1.5 py-5 px-6 w-full lg:w-[calc(50%_-_12px)] 3xl:w-[calc(50%_-_12px)] rounded-2xl transition-colors {hovered
      ? 'bg-gray-300/25 dark:bg-gray-700/25 border-gray-300/90 dark:border-gray-700/90'
      : 'bg-gray-200/25 dark:bg-gray-900/25 border-gray-300/60 dark:border-gray-700/60'} border-[1px] -ml-[1px] -mt-[1px] focusOutline"
    data-test-id="list-item"
    tabindex="0"
    role="button"
    aria-label="{t('Project')} - {project.title}"
    href={link}
    target={external ? '_blank' : undefined}
    data-sveltekit-preload-data
    on:click={onClick}
    on:keydown={onKey}
    bind:this={self}
  >
    <div class="w-full flex flex-row items-center gap-x-3 mb-0.5">
      <Icon
        classes="-ml-0.5 text-gray-900 dark:text-gray-100 {project.external
          ? 'mb-0.5'
          : ''}"
        icon={project.external ? 'open' : 'book-open'}
        width={20}
      />
      <h1
        class="w-full overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1 font-display font-bold text-xl underline-offset-[3px] decoration-[2px] {hovered
          ? 'underline'
          : ''}"
      >
        {project.title}
      </h1>
    </div>
    <div class="">
      {#if project.desc}
        <p
          class="block overflow-hidden w-full pr-6 text-ellipsis font-sans text-base line-clamp-2"
        >
          {project.desc}
        </p>
      {/if}
    </div>
    <div class="w-full flex flex-row flex-wrap gap-y-2 items-center mt-2">
      {#if project.language}
        <div
          class="flex flex-row items-center gap-x-2 text-sm font-sans text-gray-700 dark:text-gray-200"
        >
          <span
            class="relative block opacity-90 mb-0.5 w-3 h-3 rounded-full bg-[{LANGUAGE_COLOURS.get(
              project.language.toLowerCase()
            )}] border-gray-700/25 dark:border-gray-300/25 border-[0.5px] -m-[0.5px]"
            style="background: {LANGUAGE_COLOURS.get(
              project.language.toLowerCase()
            )}">&nbsp;</span
          >
          <span>{project.language}</span>
        </div>
        <BulletPoint />
      {/if}
      <p class="font-sans text-sm text-gray-700 dark:text-gray-200">
        {date}
      </p>
    </div>
  </a>
</Hoverable>
