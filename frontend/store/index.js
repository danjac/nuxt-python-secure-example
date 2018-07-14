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
    async nuxtServerInit ({ commit }, { req, app }) {
      if (req.session.authToken) {
          const data = await app.$axios.$get('/api/me/')
          commit('SET_USER', data)
      } else {
          commit('SET_USER', null)
      }
    },
    async login ({ commit }, creds) {
        await this.$axios.$post('/auth/login/', creds)
        const data = await this.$axios.$get('/api/me/')
        commit('SET_USER', data)
    },
    logout({ commit }) {
      commit('SET_USER', null)
      this.$axios.$post('/auth/logout/')
    }
  }
})

export default store
