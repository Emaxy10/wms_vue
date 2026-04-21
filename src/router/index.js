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
import Suppliers from '@/pages/Suppliers.vue'
import Clients from '@/pages/Clients.vue'
import Users from '@/pages/Users.vue'
import Warehouses from '@/pages/Warehouses.vue'
import PutAwayPage from '@/pages/PutAwayPage.vue'

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
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        name: 'products',
        component: ProductsPage
      },
      {
        path: 'products/create',
        name: 'create-product',
        component: CreateProductPage
      },
      {
        path: 'purchase-orders/add',
        name: 'add-purchase-order',
        component: AddPurchaseOrderPage
      },
      {
        path: 'stock-movements/create',
        name: 'create-stock-movement',
        component: CreateStockMovementPage
      },
      {
        path: 'stock-movements',
        name: 'stock-movements',
        component: StockMovementPage
      },
      {
        path: 'purchase-orders',
        name: 'purchase-orders',
        component: PurchaseOrdersPage
      },
      {
        path: 'users/create',
        name: 'create-user',
        component: CreateUserPage
      },{
        path: 'suppliers',
        name: 'suppliers',
        component: Suppliers
      },
      {
        path: 'clients',
        name: 'clients',
        component: Clients
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: Warehouses
      },
      {
        path: 'putaway',
        name: 'putaway',
        component: PutAwayPage
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