<script lang="ts">
  import PageHeading from '$components/headings/page-heading.svelte';
  import { onMount } from 'svelte';
  import Features from '$stores/features';
  import { navOptions, pageHeading } from '$stores/navigation';
  import ErrorText from '$components/error-text.svelte';
  import IconHeader from '$components/icon-header.svelte';
  import type UIfx from 'uifx';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  navOptions.set({ down: '/work', up: '/blog' });
  pageHeading.set('Art');

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<svelte:head>
  <title>kio.dev | art</title>
</svelte:head>

<div data-test-route="art" class="w-full">
  <PageHeading heading="Art" text="Past visual art projects" />
  <div class="mb-12">
    <IconHeader icon="Clock" text="Recent" />
    <div class="w-full flex flex-row items-center justify-center">
      <ErrorText text="No data" classes="w-fit" />
    </div>
    <a
      href="/art/all"
      class="block w-fit mt-8"
      aria-label="View all art"
      on:click={() => $CanUseSounds && click?.play()}
    >
      <IconHeader icon="ArrowRight" text="View all" classes="" />
    </a>
  </div>
</div>
