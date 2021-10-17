<template>
    <span class="text-5xl font-MetropolisBlack">{{ msg }}</span>
</template>

<script>
export default {
  name: 'Header',
  props: {
      label: String,
      msg: String
  }
}
</script>