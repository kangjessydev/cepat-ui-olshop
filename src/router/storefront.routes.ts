import type { RouteRecordRaw } from 'vue-router'

export const storefrontRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/storefront/HomeView.vue'),
    meta: { layout: 'storefront', title: 'Beranda Toko' }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/storefront/HomeView.vue'), // placeholder untuk Phase 2
    meta: { layout: 'storefront', title: 'Katalog Produk' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/storefront/HomeView.vue'), // placeholder untuk Phase 2
    meta: { layout: 'storefront', title: 'Keranjang Belanja' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/storefront/HomeView.vue'), // placeholder untuk Phase 2
    meta: { layout: 'storefront', title: 'Checkout Pesanan' }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/storefront/HomeView.vue'), // placeholder untuk Phase 2
    meta: { layout: 'storefront', title: 'Akun Pelanggan' }
  },
  {
    path: '/account/wishlist',
    name: 'wishlist',
    component: () => import('@/views/storefront/HomeView.vue'),
    meta: { layout: 'storefront', title: 'Wishlist Saya' }
  },
  {
    path: '/account/orders',
    name: 'account-orders',
    component: () => import('@/views/storefront/HomeView.vue'),
    meta: { layout: 'storefront', title: 'Pesanan Saya' }
  }
]
