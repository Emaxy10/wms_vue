import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth.js'

// Pages
import Dashboard from '@/pages/Dashboard.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'
import CreateProductPage from '@/pages/CreateProductPage.vue'
import CreateStockMovementPage from '@/pages/CreateStockMovementPage.vue'
import StockMovementPage from '@/pages/StockMovementPage.vue'
import AddPurchaseOrderPage from '@/pages/AddPurchaseOrderPage.vue'
import PurchaseOrdersPage from '@/pages/PurchaseOrdersPage.vue'
import CreateUserPage from '@/pages/CreateUserPage.vue'

// Layout
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  // 🔓 Public route
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },

  // 🔁 Redirect root to dashboard
  {
    path: '/',
    redirect: '/dashboard'
  },

  // 🔐 Protected routes
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true }, // 🔥 protect all children
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        name: 'ProductsPage',
        component: ProductsPage
      },
      {
        path: 'products/create',
        name: 'CreateProductPage',
        component: CreateProductPage
      },
      {
        path: 'purchase-orders/add',
        name: 'AddPurchaseOrderPage',
        component: AddPurchaseOrderPage
      },
      {
        path: 'stock-movements/create',
        name: 'CreateStockMovementPage',
        component: CreateStockMovementPage
      },
      {
        path: 'stock-movements',
        name: 'StockMovementPage',
        component: StockMovementPage
      },
      {
        path: 'purchase-orders',
        name: 'PurchaseOrdersPage',
        component: PurchaseOrdersPage
      },
      {
        path: 'users/create',
        name: 'CreateUserPage',
        component: CreateUserPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 🔐 GLOBAL AUTH GUARD
 */
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  

  try {
    // Restore user if page was refreshed
    if (!auth.user) {
      await auth.fetchUser()
    }
  } catch (error) {
    auth.user = null
  }

  // Check if route requires authentication
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth)

  // 🚫 Not logged in → block access
  if (requiresAuth && !auth.user) {
    return next('/login')
  }

  // ✅ Already logged in → block login page
  if (to.path === '/login' && auth.user) {
    return next('/dashboard')
  }

  next()
})

export default router