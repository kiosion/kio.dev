<script lang="ts">
  import PortableText from '$components/portable-text/portable-text.svelte';

  const { data } = $props();
</script>

<div class="mt-10 flex h-full min-w-full flex-grow flex-col gap-12">
  {#if data.config.about}
    <section class="flex w-full flex-col">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
        About me
      </h1>
      <PortableText text={data.config.about} />
    </section>
  {/if}

  {#if data.config.contact}
    <section class="flex w-full flex-col">
      <h1 class="font-display flex max-w-2xl flex-col text-5xl tracking-wide">
        Get in touch
      </h1>
      <PortableText text={data.config.contact} />
    </section>
  {/if}
</div>
