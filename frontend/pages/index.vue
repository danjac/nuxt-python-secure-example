<template>
  <div>
    Welcome to the front page<span v-if="$store.state.user">, {{ $store.state.user.username }}</span>!
    <ul>
      <li><router-link to="/secure">Secure</router-link></li>
      <li v-if="!$store.state.user"><router-link to="/login">Login</router-link></li>
      <li v-if="$store.state.user"><a href="#" @click.prevent="$store.dispatch('logout')">Logout</a></li>
    </ul>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>

<style>

</style>
