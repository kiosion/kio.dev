<script lang="ts">
  import type { ProjectDocument } from '$types';
  import { goto } from '$app/navigation';
  import BulletPoint from '../bullet-point.svelte';
  import { getShortDate } from '$helpers/date';
  import Hoverable from '$components/hoverable.svelte';
  import { t, linkTo } from '$i18n';
  import SFX from '$lib/sfx';

  export let project: ProjectDocument;

  let hovered = false;
  let self: HTMLAnchorElement;

  const onClick = (e?: MouseEvent) => {
    SFX.click.play();

    if (!e || e.target === self) {
      e?.preventDefault();
      goto(linkTo(`/work/${project.slug.current}`) as string).catch(
        () => undefined
      );
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      onClick();
    }
  };

  $: date = getShortDate(project.date);
</script>

<Hoverable bind:hovered>
  <a
    class="relative flex flex-col items-stretch justify-start gap-y-4 p-4 w-full lg:w-[calc(50%_-_12px)] 3xl:w-[calc(50%_-_12px)] rounded-2xl transition-[padding,background-color] {hovered
      ? 'bg-slate-300/50 dark:bg-slate-700/50'
      : 'bg-slate-200/50 dark:bg-slate-900/50'}"
    data-test-id="list-item"
    tabindex="0"
    role="button"
    aria-label="{t('Project')} - {project.title}"
    href={linkTo(`/work/${project.slug.current}`)}
    data-sveltekit-prefetch
    on:click={onClick}
    on:keydown={onKey}
    bind:this={self}
  >
    <div class="flex flex-col gap-y-3 p-3">
      <!-- Title / date / tags -->
      <div class="w-full flex flex-col items-center justify-start">
        <h1
          class="w-full overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1 font-display font-bold text-2xl decoration-[3px] decoration-emerald-300 {hovered
            ? 'underline'
            : ''}"
        >
          {project.title}
        </h1>
      </div>
      <div class="w-full flex flex-row items-center justify-start">
        <p class="font-sans text-base text-slate-700 dark:text-slate-200">
          {date}
        </p>
        {#if project.tags}
          <BulletPoint />
          <div class="flex flex-row justify-start items-center gap-2 flex-wrap">
            {#each project.tags as tag}
              <a
                href={linkTo(`/work/+/${tag.slug.current}`)}
                class="categoryTag-sm"
              >
                {tag.title}
              </a>
            {/each}
          </div>
        {/if}
      </div>
      <!-- Description -->
      <div class="">
        {#if project.desc}
          <p
            class="block overflow-hidden w-full pr-6 text-ellipsis font-sans text-base pt-2 line-clamp-2"
          >
            {project.desc}
          </p>
        {/if}
      </div>
    </div>
  </a>
</Hoverable>
