<template>
  <form @submit.prevent="submit">
    <div>
      <input type="text" v-model="username" placeholder="Username">
    </div>

    <div>
      <input type="password" v-model="password" placeholder="Password">
    </div>

    <div>
      <button type="submit">Login</button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit () {
      await this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
      if (this.$store.state.user) {
        this.$toast.success('Welcome back!')
        this.$router.push(decodeURIComponent(this.$route.query.next || '/'))
      }
    }
  }
}
</script>
