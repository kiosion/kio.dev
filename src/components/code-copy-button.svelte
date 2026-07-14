<script lang="ts">
  import CheckSmall from '$components/icons/check-small.svelte';
  import DocumentDuplicateSmall from '$components/icons/document-duplicate-small.svelte';

  const COPIED_RESET_MS = 1600;

  /** Returns the code to copy; read lazily so the pre's live text is used. */
  const { getText }: { getText: () => string } = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => () => clearTimeout(timer));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
    } catch {
      return; // Clipboard unavailable (insecure context / permission denied).
    }
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), COPIED_RESET_MS);
  };
</script>

<!-- Both icons stay mounted, stacked and crossfaded via the .code-copy rules
     in tailwind.css, so the swap never shifts layout. -->
<button
  type="button"
  class="code-copy"
  aria-label="Copy code"
  data-copied={copied ? 'true' : undefined}
  onclick={copy}
>
  <DocumentDuplicateSmall class="icon-copy" aria-hidden="true" />
  <CheckSmall class="icon-check" aria-hidden="true" />
</button>
