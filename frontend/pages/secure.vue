<template>
  <div>
    <h1>Secret page</h1>
    <nuxt-link to="/">Home</nuxt-link>
    <p>Secure message: {{ msg }}</p>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  async asyncData ({ app }) {
    const payload = await app.$axios.$get('/api/secure/')
    return { msg: payload.message }
  }
}
</script>
