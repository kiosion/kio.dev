<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { t } from '$i18n';

  import {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    Transition,
    TransitionChild
  } from '@rgossiaux/svelte-headlessui';

  const dispatch = createEventDispatcher();

  export let title: string,
    description: string,
    open: boolean,
    hideCancel = false,
    cancelText = 'Cancel',
    confirmText = 'Confirm';

  const onCancel = () => {
      open = false;
      dispatch('close');
    },
    onConfirm = () => {
      open = false;
      dispatch('confirm');
    };
</script>

<Transition show={open}>
  <Dialog
    {open}
    on:close={onCancel}
    class="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center overflow-x-hidden"
  >
    <span class="sr-only">Dialog</span>
    <TransitionChild
      enter="ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-out duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <DialogOverlay
        class="fixed left-0 top-0 z-[5] h-[100vh] w-[100vw] bg-light opacity-40 dark:bg-dark dark:opacity-40"
      />
    </TransitionChild>

    <TransitionChild
      enter="ease-out duration-100"
      enterFrom="opacity-80 scale-90"
      enterTo="opacity-100 scale-100"
      leave="ease-out duration-100"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-90"
    >
      <div
        class="relative z-[5] m-4 flex max-w-lg flex-col items-start justify-between gap-4 rounded-lg border border-dark/40 bg-light/60 p-6 backdrop-blur-md dark:border-light/40 dark:bg-dark/60"
      >
        <DialogTitle class="text-lg font-medium text-dark dark:text-light"
          >{title}</DialogTitle
        >
        <DialogDescription class="max-w-sm text-base text-dark/90 dark:text-light/90"
          >{description}</DialogDescription
        >

        <slot />

        <div
          class="-mb-2 mt-2 flex w-full justify-start gap-5 border-t border-t-dark/40 pt-3 dark:border-t-light/40"
        >
          <button
            class="focusOutline-sm rounded-lg px-3 py-1 font-code font-medium text-dark decoration-accent-light decoration-2 underline-offset-[6px] hover:underline focus-visible:underline dark:text-light dark:decoration-accent-dark"
            on:click={onConfirm}>{$t(confirmText)}</button
          >
          {#if !hideCancel}
            <button
              class="focusOutline-sm rounded-lg px-3 py-1 font-code font-medium text-dark decoration-accent-light decoration-2 underline-offset-[6px] hover:underline focus-visible:underline dark:text-light dark:decoration-accent-dark"
              on:click={onCancel}>{$t(cancelText)}</button
            >
          {/if}
        </div>
      </div>
    </TransitionChild>
  </Dialog>
</Transition>
