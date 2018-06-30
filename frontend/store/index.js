import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req, app }) {
      if (req.session && req.session.user) {
        commit('SET_USER', req.session.user)
      }
    },
    async login ({ commit }, creds) {
      try {
        const data = await this.$axios.$post('/auth/login/', creds)
        commit('SET_USER', data)
      } catch (e) {
        console.log('error', e)
        commit('SET_USER', null)
      }
    },
    logout({ commit }) {
      commit('SET_USER', null)
      this.$axios.post('/auth/logout/')
    }
  }
})

export default store
