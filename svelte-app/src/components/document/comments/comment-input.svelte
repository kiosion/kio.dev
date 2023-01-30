<script lang="ts">
  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Hoverable from '$components/hoverable.svelte';
  import LinkNonPt from '$components/link-non-pt.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import { t, linkTo } from '$i18n';
  import type { ExternalUserInfo } from '$types';
  import type { ActionResult } from '@sveltejs/kit';

  export let userInfo: ExternalUserInfo | null = null;

  let submitActive = false,
    loading = false;

  const handleSubmit = async (
    event: Event & {
      readonly submitter: HTMLElement | null;
      target: EventTarget & HTMLFormElement;
    } & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    if (!event.target) {
      return;
    }
    loading = true;

    const data = new FormData(event.target as HTMLFormElement);

    const response = await fetch('/api/v1/comment?/post', {
      method: 'POST',
      body: data
    });

    const result: ActionResult = deserialize(await response.text());

    console.log('got result:', result);

    if (result.type === 'success') {
      await invalidateAll();
      // Clear textarea
      event.target.reset();
    }

    loading = false;

    applyAction(result);
  };

  let textarea: HTMLTextAreaElement;

  const setTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = '5px';
    textarea.style.height = textarea.scrollHeight + 2 + 'px';
  };

  $: if (textarea) {
    setTextareaHeight(textarea);
  }
</script>

<form
  method="POST"
  action="/api/v1/comment?/post"
  on:submit|preventDefault={(e) => handleSubmit(e)}
>
  <img src={userInfo?.avatar_url || '/assets/user.svg'} alt="User avatar" />
  <div class="flex flex-row gap-4 w-full h-full items-center">
    {#if userInfo}
      <textarea
        class="focusOutline"
        placeholder="Leave a comment..."
        bind:this={textarea}
        on:input={() => setTextareaHeight(textarea)}
      />
    {:else}
      <div
        class="overflow-hidden w-full h-fit p-2 rounded-md bg-stone-50/80 dark:bg-stone-700/60"
      >
        <LinkNonPt href={linkTo('/auth/login')}>{t('Log in')}</LinkNonPt>
        {t('to leave a comment')}
      </div>
    {/if}
    {#if loading}
      <Spinner />
    {/if}
    <Hoverable bind:hovered={submitActive}>
      <input
        type="submit"
        value={t('Send')}
        class="focusOutline-sm"
        disabled={!userInfo || loading}
        class:active={submitActive}
      />
    </Hoverable>
  </div>
</form>

<style lang="postcss">
  form {
    @apply flex flex-row gap-4 px-4 py-3 rounded-lg items-center justify-between w-full bg-stone-300/50;

    img {
      @apply h-10 w-10 aspect-square rounded-full;
    }
  }

  input {
    @apply cursor-pointer rounded-md border px-2 py-1 text-base font-code border-stone-400 transition-colors;

    &.active:not(:disabled) {
      @apply border-2 bg-violet-400 border-stone-800 text-stone-900;
    }

    &:disabled {
      @apply bg-stone-400/40 cursor-not-allowed;
    }
  }
  textarea {
    @apply overflow-hidden w-full p-2 rounded-md resize-none bg-stone-100/80;
  }
  :global(.dark) {
    form {
      @apply bg-stone-900/50;
    }

    textarea {
      @apply bg-stone-700/60;
    }

    input {
      &.active:not(:disabled) {
        @apply border-stone-100;
      }
    }
  }
</style>
