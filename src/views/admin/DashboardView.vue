<template>
  <div class="space-y-6 pb-12">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/15">
      <div class="space-y-1.5">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
          <Sparkles :size="13" /> Status Toko: Buka Normal
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight">Selamat Datang, Admin Toko 👋</h1>
        <p class="text-emerald-100 text-xs sm:text-sm max-w-xl">
          Berikut adalah ringkasan performa toko online Anda hari ini. Ada <span class="font-bold text-white underline">{{ pendingOrdersCount }} pesanan</span> yang menunggu tindakan Anda.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 shrink-0">
        <router-link
          to="/admin/products"
          class="px-4 py-2.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-1.5"
        >
          <Plus :size="16" /> Tambah Produk
        </router-link>
        <router-link
          to="/admin/vouchers"
          class="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 border border-white/20 text-white text-xs sm:text-sm font-medium transition flex items-center gap-1.5"
        >
          <TicketPercent :size="16" /> Buat Promo
        </router-link>
      </div>
    </div>

    <!-- 4 Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Omzet Bulan Ini</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign :size="16" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {{ formatRupiah(totalRevenue) }}
        </div>
        <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp :size="13" /> +14.2% dibanding bulan lalu
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Pesanan Masuk</span>
          <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShoppingCart :size="16" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {{ orders.length }} Pesanan
        </div>
        <div class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
          <Clock :size="13" /> {{ pendingOrdersCount }} menunggu verifikasi bayar
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Produk Aktif</span>
          <div class="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Package :size="16" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {{ products.length }} Produk
        </div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          6 Kategori katalog aktif
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Stok Kritis</span>
          <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle :size="16" />
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
          {{ lowStockProducts.length }} Produk
        </div>
        <div class="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
          Perlu restock segera (&le; 5 pcs)
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Revenue Chart & Recent Orders -->
      <div class="lg:col-span-2 space-y-6">
        <RevenueChart />
        <RecentOrdersTable :orders="orders.slice(0, 5)" />
      </div>

      <!-- Right 1 Col: Low Stock & Top Products -->
      <div class="space-y-6">
        <LowStockWidget :products="lowStockProducts" />
        <TopProductsWidget :products="topProducts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  TicketPercent,
  TrendingUp
} from '@lucide/vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { productRepository, orderRepository } from '@/repositories'
import type { Product, Order } from '@/types'
import RevenueChart from '@/components/admin/RevenueChart.vue'
import RecentOrdersTable from '@/components/admin/RecentOrdersTable.vue'
import LowStockWidget from '@/components/admin/LowStockWidget.vue'
import TopProductsWidget from '@/components/admin/TopProductsWidget.vue'

const products = ref<Product[]>([])
const orders = ref<Order[]>([])

onMounted(async () => {
  const [prods, ords] = await Promise.all([
    productRepository.getAll(),
    orderRepository.getAll()
  ])
  products.value = prods
  orders.value = ords
})

const pendingOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'pending_payment').length
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0)
})

const lowStockProducts = computed(() => {
  return products.value.filter(p => p.stock <= 5)
})

const topProducts = computed(() => {
  return [...products.value].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4)
})
</script>
