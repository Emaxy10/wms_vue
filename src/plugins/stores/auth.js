import { defineStore } from 'pinia'
 import api from '@/plugins/api.js'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
  }),

  actions: {
    async getCsrf() {
      await api.get('/sanctum/csrf-cookie')
    },

    async login(credentials) {
      this.loading = true
      try {
        await this.getCsrf()
        await api.post('/login', credentials)
        await this.fetchUser()
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
      const res = await api.get('/user')
      this.user = res.data
    } catch (error) {
    if (error.response?.status === 401) {
      this.user = null
    } else {
      console.error('Unexpected error:', error)
    }
      throw error
    }
    },

    async logout() {
      await api.post('/logout')
      this.user = null
    },
  },
})



