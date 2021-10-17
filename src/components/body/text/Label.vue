<template>
    <span class="text-sm font-FiraCode lowercase">{{ msg }}</span>
</template>

<script>
export default {
  name: 'Label',
  props: {
      msg: String
  }
}
</script>