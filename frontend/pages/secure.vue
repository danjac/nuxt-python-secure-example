<template>
  <div>
    <h1>Secret page</h1>
    <router-link to="/">Home</router-link>
    <p>Secure message: {{ msg }}</p>
  </div>
</template>

<script>
export default {
  fetch ({ store, redirect }) {
    if (!store.state.user) {
      redirect('/login')
    }
  },
  async asyncData ({ app }) {
    const payload = await app.$axios.$get('/api/secure/')
    return { msg: payload.message }
  }
}
</script>
