import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import LoginPage from '@/pages/LoginPage.vue'

const routes = [
  {
    path:'/',
    name:'Dashboard',
    component: Dashboard
  },
  {
    path:'/login',
    name:'LoginPage',
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router