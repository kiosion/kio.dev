<script lang="ts">
  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import LinkNonPt from '$components/link-non-pt.svelte';
  import Spinner from '$components/loading/spinner.svelte';
  import { t, linkTo } from '$i18n';
  import { page } from '$app/stores';
  import type { ExternalUserInfo } from '$types';
  import type { ActionResult } from '@sveltejs/kit';
  import Icon from '$components/icon.svelte';
  import Button from '$components/controls/button.svelte';

  export let userInfo: ExternalUserInfo | null = null;

  let loading = false,
    submit: HTMLInputElement;

  const handleSubmit = async (
    event: Event & {
      readonly submitter: HTMLElement | null;
      target: EventTarget | null;
    } & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    if (!event.target) {
      return;
    }
    const target = event.target as EventTarget & HTMLFormElement;

    loading = true;

    const data = new FormData(target);

    const response = await fetch('/api/v1/comment?/post', {
      method: 'POST',
      body: data
    });

    const result: ActionResult = deserialize(await response.text());

    if (result.type === 'success') {
      await invalidateAll();
      target.reset();
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
  {#if userInfo?.avatar_url}
    <img src={userInfo.avatar_url} alt="User avatar" />
  {:else}
    <div class="userIcon--placeholder">
      <Icon icon="User" />
    </div>
  {/if}

  <div class="flex h-full w-full flex-row items-center gap-4">
    {#if userInfo}
      <textarea
        class="focusOutline-sm"
        placeholder="Leave a comment..."
        bind:this={textarea}
        on:input={() => setTextareaHeight(textarea)}
      />
    {:else}
      <div
        class="h-fit w-full overflow-hidden rounded-md bg-stone-50/80 p-2 dark:bg-stone-700/60"
      >
        <LinkNonPt href={linkTo(`/auth/login?redirect=${$page.url.pathname}`)}
          >{t('Log in')}</LinkNonPt
        >
        {t('to leave a comment')}
      </div>
    {/if}

    <input type="submit" hidden bind:this={submit} />

    <Button
      type="button"
      on:click={() => {
        submit.click();
      }}
      disabled={!userInfo || loading}
    >
      <span class="flex flex-row items-center gap-2">
        {#if loading}
          <Spinner classNames="mt-0 ml-0" />
        {/if}
        {t('Post')}
      </span>
    </Button>
  </div>
</form>

<style lang="scss">
  form {
    @apply flex w-full flex-row items-center justify-between gap-4 rounded-xl bg-stone-300/50 p-4;

    img {
      @apply aspect-square h-10 w-10 rounded-full;
    }

    .userIcon--placeholder {
      @apply flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-stone-400/50;
    }
  }
  textarea {
    @apply w-full resize-none overflow-hidden rounded-md bg-stone-100/80 p-2;
  }
  :global(.dark) {
    form {
      @apply bg-stone-900/50;
    }

    textarea {
      @apply bg-stone-700/60;
    }
  }
</style>
