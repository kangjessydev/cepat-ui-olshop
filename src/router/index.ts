import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './admin.routes'
import { storefrontRoutes } from './storefront.routes'
import { authAdapter } from '@/plugins/auth'
import { useAuthStore } from '@/core/stores/auth.store'
import appConfig from '@/app.config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Storefront public routes
    ...storefrontRoutes,

    // Admin dashboard routes
    ...adminRoutes,

    // Auth routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/pages/auth/login.vue'),
      meta: { layout: 'auth', requiresAuth: false, title: 'Masuk Admin' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/login.vue'),
      meta: { layout: 'auth', requiresAuth: false, title: 'Masuk Akun' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/register.vue'),
      meta: { layout: 'auth', requiresAuth: false, title: 'Daftar Akun' }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/auth/forgot-password.vue'),
      meta: { layout: 'auth', requiresAuth: false, title: 'Lupa Password' }
    },

    // Error routes
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/errors/ForbiddenView.vue'),
      meta: { layout: 'blank', title: '403 — Akses Ditolak' }
    },
    {
      path: '/500',
      name: 'server-error',
      component: () => import('@/views/errors/ServerErrorView.vue'),
      meta: { layout: 'blank', title: '500 — Gangguan Server' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: { layout: 'blank', title: '404 — Halaman Tidak Ditemukan' }
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

let sessionRestored = false

// Navigation guards
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // On first navigation, restore session
  if (!sessionRestored) {
    sessionRestored = true
    auth.initAuth()
    if (auth.token) {
      try {
        const user = await authAdapter.getUser()
        auth.user = user
      } catch {
        auth.clearAuth()
      }
    }
  }

  // Update document title
  const appName = appConfig.name || 'Cepat UI Olshop'
  document.title = to.meta.title ? `${to.meta.title} — ${appName}` : appName

  // Check auth requirement for protected routes
  const requiresAuth = to.meta.requiresAuth === true
  if (requiresAuth && !auth.isAuthenticated) {
    const isUnderAdmin = to.path.startsWith('/admin')
    return {
      path: isUnderAdmin ? '/admin/login' : '/login',
      query: { redirect: to.fullPath }
    }
  }

  // Role check if required
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = auth.user && (
      requiredRoles.some(role => auth.hasRole(role)) ||
      auth.user.roles.includes('super_admin') ||
      auth.user.roles.includes('admin')
    )
    if (!hasRole) {
      return { path: '/403' }
    }
  }

  // Redirect authenticated user from admin login page to /admin
  if (to.path === '/admin/login' && auth.isAuthenticated) {
    return { path: '/admin' }
  }
})

export default router
