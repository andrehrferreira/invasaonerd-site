<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">{{ error.message }}</h1>
    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/">Página inicial</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>
