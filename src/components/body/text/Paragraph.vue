<template>
    <span class="text-base font-FiraCode">{{ msg }}</span>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
      msg: String
  }
}
</script>