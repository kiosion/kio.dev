<template>
    <div class="py-1"><img class="w-4 sm:w-8" v-bind:src="'@/assets/img/' + path"/></div>
</template>

<script>
export default {
  name: 'NavLogo',
  props: {
      path: String
  }
}
</script>