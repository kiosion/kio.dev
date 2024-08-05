<script lang="ts">
  import { linkTo, t } from '$lib/i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import EmptyContent from '$components/empty-content.svelte';
  import HeadedBlock from '$components/headings/headed-block.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import BaseContainer from '$components/layouts/base-container.svelte';

  export let data;
</script>

<div class="flex flex-col gap-5">
  <BaseContainer class="flex flex-row items-center justify-end gap-3 p-2">
    <ArrowButton
      href={$linkTo('/thoughts')}
      dir="left"
      placement="before"
      text={$t('All posts')}
      preload
    />
  </BaseContainer>

  <BaseContainer>
    <HeadedBlock heading={$t('Topics')} constrainWidth={false} first>
      {#if data.tags?.length}
        <div class="flex flex-col gap-5 px-8 pt-3">
          {#each data.tags as tag}
            {@const posts = data.postsByTag[tag._id]}
            <Hoverable let:hovered>
              <a
                href={$linkTo(`/thoughts/+/${tag.slug.current}`)}
                class="focus-outline -mx-3 -my-2 flex flex-row items-center justify-between gap-x-4 rounded-lg px-3 py-2 transition-all"
                class:active={hovered}
                data-sveltekit-preload-code
              >
                <h2
                  class="font-mono text-md text-dark dark:text-light"
                  class:text-orange-light={hovered}
                  class:dark:text-orange-light={hovered}
                  class:italic={hovered}
                >
                  {tag.title}
                </h2>
                <span
                  class="transiton-all inline h-full w-full min-w-0 flex-1 border-b border-dashed border-neutral-200 dark:border-neutral-400"
                ></span>
                <span class="text-sm text-neutral-500 dark:text-neutral-200">
                  {posts?.length ?? 0}
                  {$t((posts?.length ?? 0) === 1 ? 'Post' : 'Posts').toLowerCase()}
                </span>
              </a>
            </Hoverable>
          {/each}
        </div>
      {:else}
        <EmptyContent />
      {/if}
    </HeadedBlock>
  </BaseContainer>
</div>

<style lang="scss">
  @import '@styles/mixins';
  @import '@styles/helpers';
  @import '@styles/colors';

  a.active {
    background: radial-gradient(
      circle at 100% 80%,
      rgba($neutral-0, 1),
      rgba($neutral-0, 0.4)
    );

    @include dark {
      background: radial-gradient(
        circle at 100% 80%,
        rgba($neutral-700, 1),
        rgba($neutral-700, 0.4)
      );
    }
  }
</style>
