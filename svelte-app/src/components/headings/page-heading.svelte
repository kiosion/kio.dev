<script lang="ts">
  export let heading: string | undefined = undefined;
</script>

<div class="my-12">
  {#if heading}
    <p class="text-center">{heading}</p>
  {/if}
</div>
