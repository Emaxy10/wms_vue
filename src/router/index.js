import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/pages/Dashboard.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'
import CreateProductPage from '@/pages/CreateProductPage.vue'
import CreateStockMovementPage from '@/pages/CreateStockMovementPage.vue'
import StockMovementPage from '@/pages/StockMovementPage.vue'
import AddPurchaseOrderPage from '@/pages/AddPurchaseOrderPage.vue'
import PurchaseOrdersPage from '@/pages/PurchaseOrdersPage.vue'

import MainLayout from '@/layouts/MainLayout.vue'

const routes = [

  // 👇 Redirect root ("/") to login page
      {
        path: '/login',
        name: 'Login',
        component: LoginPage
      
        
      },


  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },{
        path: 'products',
        name: 'ProductsPage',
        component: ProductsPage
      },
      {
        path:'products/create',
        name:'CreateProductPage',
        component: CreateProductPage
      },
      {
        path:'purchase-orders/add',
        name:'AddPurchaseOrderPage',
        component: AddPurchaseOrderPage
      },{
          path:'/stock-movements/create',
          name:'CreateStockMovementPage',
          component: CreateStockMovementPage
        },{
          path:'/stock-movements',
          name:'StockMovementPage',
          component: StockMovementPage
        },{
          path:'purchase-orders',
          name:'PurchaseOrdersPage',
          component: PurchaseOrdersPage
        }
    ]
  },




]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router