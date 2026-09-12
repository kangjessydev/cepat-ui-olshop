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
    component: () => import('@/views/storefront/ProductCatalogView.vue'),
    meta: { layout: 'storefront', title: 'Katalog Produk' }
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/storefront/ProductDetailView.vue'),
    meta: { layout: 'storefront', title: 'Detail Produk' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/storefront/CartView.vue'),
    meta: { layout: 'storefront', title: 'Keranjang Belanja' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/storefront/CheckoutView.vue'),
    meta: { layout: 'storefront', title: 'Checkout Pesanan' }
  },
  {
    path: '/orders/:id/success',
    name: 'order-success',
    component: () => import('@/views/storefront/OrderSuccessView.vue'),
    meta: { layout: 'storefront', title: 'Pesanan Berhasil' }
  },
  {
    path: '/tracking',
    name: 'tracking',
    component: () => import('@/views/storefront/OrderTrackingView.vue'),
    meta: { layout: 'storefront', title: 'Lacak Pesanan' }
  },
  {
    path: '/login',
    name: 'customer-login',
    component: () => import('@/views/storefront/CustomerLoginView.vue'),
    meta: { layout: 'storefront', title: 'Masuk Akun' }
  },
  {
    path: '/register',
    name: 'customer-register',
    component: () => import('@/views/storefront/CustomerRegisterView.vue'),
    meta: { layout: 'storefront', title: 'Daftar Akun Baru' }
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/storefront/WishlistView.vue'),
    meta: { layout: 'storefront', title: 'Wishlist Favorit' }
  },
  {
    path: '/account/wishlist',
    redirect: '/wishlist'
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/storefront/AccountView.vue'),
    meta: { layout: 'storefront', title: 'Akun Pelanggan' }
  },
  {
    path: '/account/orders',
    name: 'account-orders',
    component: () => import('@/views/storefront/AccountView.vue'),
    meta: { layout: 'storefront', title: 'Pesanan Saya' }
  }
]
