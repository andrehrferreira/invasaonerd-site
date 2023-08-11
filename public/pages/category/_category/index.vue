<template>
  <v-container>
    <pre>{{ pages }}</pre>
  </v-container>
</template>

<script>
export default {
  async asyncData({ params: { category }, app: { $axios } }) {
    if (category) {
      const pages = await $axios.$get(`/index/pages?category=${category}`)
      return {
        ...pages
      }
    }
  }
}
</script>

<style></style>
