import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Ringkasan Toko', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/views/admin/ProductListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Manajemen Produk', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/products/create',
    name: 'admin-products-create',
    component: () => import('@/views/admin/ProductFormView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Tambah Produk Baru', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/products/:id/edit',
    name: 'admin-products-edit',
    component: () => import('@/views/admin/ProductFormView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Edit Produk', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/views/admin/OrderListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Manajemen Pesanan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/orders/:id',
    name: 'admin-orders-detail',
    component: () => import('@/views/admin/OrderDetailView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Detail Pesanan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/customers',
    name: 'admin-customers',
    component: () => import('@/views/admin/CustomerListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Data Pelanggan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/customers/:id',
    name: 'admin-customers-detail',
    component: () => import('@/views/admin/CustomerDetailView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Detail Pelanggan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/vouchers',
    name: 'admin-vouchers',
    component: () => import('@/views/admin/VoucherListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Voucher & Promo', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/flash-sale',
    name: 'admin-flash-sale',
    component: () => import('@/views/admin/FlashSaleListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Flash Sale', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/reviews',
    name: 'admin-reviews',
    component: () => import('@/views/admin/ReviewListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Moderasi Ulasan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('@/views/admin/ReportsView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Laporan Penjualan', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('@/views/admin/SettingsView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Pengaturan Toko', roles: ['admin', 'super_admin'] }
  }
]
