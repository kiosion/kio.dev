<script lang="ts">
  export let title: string, subtitle: string;
</script>

<h1 class="font-code font-bold text-4xl text-center my-8 lowercase">{title}</h1>
{#if subtitle}
  <p class="text-center">{subtitle}</p>
{/if}
