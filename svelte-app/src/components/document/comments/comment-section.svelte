<script lang="ts">
  import IconHeader from '$components/headings/icon-header.svelte';
  import CommentInput from '$components/document/comments/comment-input.svelte';
  import { t } from '$i18n';
  import type { Comment, ExternalUserInfo, ResDataMany } from '$types';

  export let userInfo: ExternalUserInfo | null = null,
    comments: ResDataMany<Comment>;
</script>

<IconHeader
  icon="comment"
  text={t('Comments')}
  classes="mt-8 mb-4 w-full h-fit"
/>

<CommentInput {userInfo} />

<div class="mt-4">
  {#if comments.data?.length > 0}
    {#each comments.data as comment}
      <div class="mb-4">
        <p>{comment.name}{comment.username ? ` (@${comment.username})` : ''}</p>
        <p>{comment.body}</p>
      </div>
    {/each}
  {:else}
    <p>No comments yet...</p>
  {/if}
  <!-- <CommentList {comments} /> -->
</div>
