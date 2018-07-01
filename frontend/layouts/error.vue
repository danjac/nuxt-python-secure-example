<template>
  <div class="container">
    <h1>An error occurred</h1>
    <h2 v-if="error.statusCode === 404">Page not found</h2>
    <h2 v-if="error.statusCode === 401">You are not authenticated</h2>
    <nuxt-link v-if="error.statusCode === 401" to="/login">Login here to continue</nuxt-link>
    <nuxt-link v-else to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  // layout: 'blog'
}
</script>
