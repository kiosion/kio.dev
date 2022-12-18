<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Tags from '$components/tags.svelte';
  import { t } from '$i18n';
  import Features from '$stores/features';
  import type { PostDocument, ProjectDocument, ResData, Comment } from '$types';

  export let model: 'post' | 'project',
    data: PostDocument | ProjectDocument,
    comments: ResData<Comment[]> | undefined = undefined;

  $: extLinks =
    model === 'project' &&
    ((data as ProjectDocument)
      .externalLinks as ProjectDocument['externalLinks'] &
      {
        hovered: boolean;
      }[]);
  $: canSeeComments = Features.can('use comments feature');
  $: console.log('got comments:', comments);
</script>

<div class="mt-4" data-test-id="{model}-footer">
  <Divider />
  {#if data.tags && data.tags.length > 0}
    <IconHeader
      icon="CardText"
      text={t('Tags')}
      classes="mt-8 mb-4 w-full h-fit"
    />
    <Tags {model} data={data.tags} size="lg" />
  {/if}
  {#if extLinks && extLinks.length > 0}
    <Divider />
    <IconHeader
      icon="link"
      text={t('Links')}
      classes="mt-8 mb-4 w-full h-fit"
    />
    <ul class="list-disc ml-8">
      {#each extLinks as link}
        <li>
          <Hoverable bind:hovered={link.hovered}>
            <a
              href={link.url}
              target={'_blank'}
              rel={'noopener noreferrer'}
              class="underlined from-emerald-400 dark:from-emerald-300 {link.hovered
                ? 'active dark:text-slate-800'
                : ''} rounded-sm focusOutline-sm px-[2px] -mx[2px]"
              tabindex="0"
            >
              {link.title}
            </a>
          </Hoverable>
        </li>
      {/each}
    </ul>
  {/if}
  {#if $canSeeComments && comments}
    <Divider />
    <IconHeader
      icon="comment"
      text={t('Comments')}
      classes="mt-8 mb-4 w-full h-fit"
    />
    {#await comments}
      <div class="flex justify-center items-center h-32">
        <p>Loading...</p>
      </div>
    {:then comments}
      <div class="mt-4">
        {#if comments.data?.length > 0}
          {#each comments.data as comment}
            <div class="mb-4">
              <p>{comment.name}{comment.email ? ` (${comment.email})` : ''}</p>
              <p>{comment.body}</p>
            </div>
          {/each}
        {:else}
          <p>No comments yet...</p>
        {/if}
        <!-- <CommentList {comments} /> -->
      </div>
    {/await}
  {/if}
</div>

<style lang="scss">
  .underlined {
    text-decoration: none;
    background-image: linear-gradient(
      to right,
      var(--tw-gradient-from) 0%,
      var(--tw-gradient-from) 100%
    );
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease;
    &.active {
      background-size: calc(100% - 4px) 100%;
    }
  }
</style>
