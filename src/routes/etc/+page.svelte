<script lang="ts">
  let { data } = $props();
  let EtcContent = $derived(data.content.Component);
</script>
<section class="text-md mt-8 flex w-full flex-col gap-6">
  <h1 class="font-display font-semibold flex max-w-2xl flex-col text-4xl md:text-5xl tracking-wide">
    {data.content.title}
  </h1>
  <EtcContent />
</section>
