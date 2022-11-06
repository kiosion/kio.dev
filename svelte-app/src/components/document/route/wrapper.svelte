<script lang="ts">
  import { onMount } from 'svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Sidebar from '$components/document/sidebar.svelte';
  import ContentWrapper from '$components/content-wrapper.svelte';
  import SafeIcon from '$components/safe-icon.svelte';
  import { sidebarOpen } from '$stores/navigation';
  import Features from '$stores/features';
  import Content from '$components/document/content/content.svelte';
  import type UIfx from 'uifx';
  import type { PostDocument, ProjectDocument } from '$lib/types';

  let click: UIfx;

  onMount(() => {
    import('$lib/sfx').then((sfx) => {
      click = sfx.click;
    });
  });

  export let model: 'post' | 'project';
  export let data: ProjectDocument | PostDocument | undefined;

  $: CanUseSounds = Features.can('use sounds feature');
</script>

<div
  class="flex flex-row items-stretch justify-start translate-y-14 h-fit"
  data-test-route={model}
>
  {#if data}
    <Hoverable>
      <div
        class="sticky self-start w-0 top-12 xl:-translate-x-[4px] 2xl:translate-x-0"
      >
        <button
          class="flex flex-row items-center justify-start text-base font-code"
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          on:click={() => {
            $CanUseSounds && click?.play();
            sidebarOpen.set(!$sidebarOpen);
          }}
          on:keydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
              $CanUseSounds && click?.play();
              sidebarOpen.set(!$sidebarOpen);
            }
          }}
        >
          <SafeIcon icon={$sidebarOpen ? 'BookOpen' : 'Book'} />
          <p class="ml-4">{$sidebarOpen ? 'Hide' : 'Show'}</p>
        </button>
      </div>
    </Hoverable>
    <Sidebar post={data} show={$sidebarOpen} />
    <ContentWrapper>
      <Content {model} {data} />
    </ContentWrapper>
  {/if}
</div>
