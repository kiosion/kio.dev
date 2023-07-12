<script lang="ts">
  import { goto } from '$app/navigation';
  import { formatDate } from '$helpers/date';
  import { linkTo, t } from '$i18n';
  import { LANGUAGE_COLOURS } from '$lib/consts';
  import SFX from '$lib/sfx';

  import Hoverable from '$components/hoverable.svelte';
  import Icon from '$components/icon.svelte';

  import BulletPoint from '../bullet-point.svelte';

  import type { ProjectDocument } from '$types';

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
        goto($linkTo(`/work/${project.slug.current}`)).catch(() => undefined);
      }
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      onClick();
    }
  };

  $: date = formatDate(project.date, 'med');
  $: external = project.external;
  $: link = (() => {
    return external && project.externalUrl
      ? project.externalUrl
      : $linkTo(`/work/${project.slug.current}`);
  })();
</script>

<Hoverable bind:hovered>
  <a
    class="relative flex w-full flex-col items-stretch justify-start gap-y-1.5 rounded-xl px-6 py-5 lg:w-[calc(50%_-_12px)] 3xl:w-[calc(50%_-_12px)] {hovered
      ? 'border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-dark/40'
      : 'border-dark/40 bg-dark/5 dark:border-light/40 dark:bg-dark/20'} focusOutline -ml-[1px] -mt-[1px] border transition-[background-color,border-color]"
    data-test-id="list-item"
    tabindex="0"
    role="button"
    aria-label="{$t('Project')} - {project.title}"
    href={link}
    target={external ? '_blank' : undefined}
    data-sveltekit-preload-code
    on:click={onClick}
    on:keydown={onKey}
    bind:this={self}
  >
    <div class="mb-0.5 flex w-full flex-row items-center gap-x-3">
      <Icon
        classNames="-ml-0.5 text-dark dark:text-light {project.external ? 'mb-0.5' : ''}"
        icon={project.external ? 'open' : 'book-open'}
        width={20}
      />
      <h1
        class="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-display text-xl font-bold decoration-[2px] underline-offset-[3px] {hovered
          ? 'underline'
          : ''}"
      >
        {project.title}
      </h1>
    </div>
    <div class="">
      {#if project.desc}
        <p
          class="line-clamp-2 w-full overflow-hidden text-ellipsis pr-6 font-sans text-base"
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
        <BulletPoint classNames="mb-[1px]" />
      {/if}
      <p class="text-gray-700 dark:text-gray-200 font-sans text-sm">
        {date}
      </p>
    </div>
  </a>
</Hoverable>
