<template>
    <span class="text-base font-FiraCode leading-8">{{ msg }}</span>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
      msg: String
  }
}
</script>