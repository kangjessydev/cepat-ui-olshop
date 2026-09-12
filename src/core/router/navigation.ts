// src/core/router/navigation.ts
// 🔑 MENU SIDEBAR ADMIN CEPAT UI OLSHOP
// Setiap item otomatis muncul di sidebar admin.

import type { NavItem } from '@/core/types'

export const navigationItems: NavItem[] = [
  {
    title: 'Ringkasan Toko',
    icon: 'LayoutDashboard',
    route: '/admin',
    order: 1,
  },
  {
    title: 'Manajemen Produk',
    icon: 'Package',
    route: '/admin/products',
    order: 2,
  },
  {
    title: 'Manajemen Pesanan',
    icon: 'ShoppingCart',
    route: '/admin/orders',
    order: 3,
  },
  {
    title: 'Data Pelanggan',
    icon: 'Users',
    route: '/admin/customers',
    order: 4,
  },
  {
    title: 'Voucher & Diskon',
    icon: 'TicketPercent',
    route: '/admin/vouchers',
    order: 5,
  },
  {
    title: 'Flash Sale',
    icon: 'Zap',
    route: '/admin/flash-sale',
    order: 6,
    badge: 'Aktif',
    badgeVariant: 'warning',
  },
  {
    title: 'Ulasan Produk',
    icon: 'Star',
    route: '/admin/reviews',
    order: 7,
  },
  {
    title: 'Laporan Penjualan',
    icon: 'BarChart3',
    route: '/admin/reports',
    order: 8,
  },
  {
    title: 'Pengaturan Toko',
    icon: 'Store',
    route: '/admin/settings',
    order: 9,
  },

  // --- UI Kit Showcase ---
  {
    title: 'UI Kit Showcase',
    icon: 'Boxes',
    order: 20,
    children: [
      {
        title: 'Components',
        icon: 'Component',
        route: '/ui/components',
      },
      {
        title: 'AutoForm',
        icon: 'FormInput',
        route: '/ui/forms',
      },
    ],
  },
]
