import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'
import CreateProductPage from '@/pages/CreateProductPage.vue'
import CreateStockMovementPage from '@/pages/CreateStockMovementPage.vue'

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
  },{
    path:'/products',
    name:'ProductsPage',
    component: ProductsPage
  },
  {
    path:'/products/create',
    name:'CreateProductPage',
    component: CreateProductPage
  },{
    path:'/stock-movements/create',
    name:'CreateStockMovementPage',
    component: CreateStockMovementPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router