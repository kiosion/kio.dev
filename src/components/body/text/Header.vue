<template>
    <span class="text-5xl font-MetropolisBlack lowercase">{{ msg }}</span>
</template>

<script>
export default {
  name: 'Header',
  props: {
      msg: String
  }
}
</script>