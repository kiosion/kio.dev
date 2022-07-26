<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';
  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/api/pgp');
    const response = await res.json();
    return { props: { pgp: response.data } };
  };
</script>

<script lang="ts">
  import CodeBlock from '@/components/code-block.svelte';

  export let pgp: any; // eslint-disable-line @typescript-eslint/no-explicit-any
</script>

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">pgp</h1>
<p class="text-center">Want to send a secure message my way? Here's my public PGP key.</p>

<CodeBlock content={`${pgp}`} showClipboard={true} />
