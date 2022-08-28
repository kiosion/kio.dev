<script lang="ts">
  export let heading: string | undefined = undefined;
</script>

<div class="mt-14 mb-8">
  {#if heading}
    <p class="text-center">{heading}</p>
  {/if}
</div>
