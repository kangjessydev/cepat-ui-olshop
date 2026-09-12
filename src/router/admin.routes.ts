import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Ringkasan Toko', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/pages/dashboard/index.vue'), // placeholder untuk Phase 1
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Manajemen Produk', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/pages/dashboard/index.vue'), // placeholder untuk Phase 1
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Manajemen Pesanan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/customers',
    name: 'admin-customers',
    component: () => import('@/pages/users/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Data Pelanggan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/vouchers',
    name: 'admin-vouchers',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Voucher & Promo', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/flash-sale',
    name: 'admin-flash-sale',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Flash Sale', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/reviews',
    name: 'admin-reviews',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Moderasi Ulasan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('@/pages/analytics/index.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Laporan Penjualan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('@/pages/settings/general.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Pengaturan Toko', roles: ['admin', 'super_admin'] }
  }
]
