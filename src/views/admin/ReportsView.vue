<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatRupiah, formatCompactNumber } from '@/utils/formatCurrency'
import { exportToCsv } from '@/utils/exportCsv'
import { toast } from 'vue-sonner'

const selectedPeriod = ref<'7d' | '30d' | 'month'>('7d')

// Mock historical data
const periodData = {
  '7d': {
    revenue: 4780000,
    orders: 14,
    aov: 341428,
    successRate: 92.8,
    trend: [
      { date: '06 Sep', amount: 480000, orders: 2 },
      { date: '07 Sep', amount: 620000, orders: 3 },
      { date: '08 Sep', amount: 390000, orders: 1 },
      { date: '09 Sep', amount: 890000, orders: 2 },
      { date: '10 Sep', amount: 540000, orders: 2 },
      { date: '11 Sep', amount: 950000, orders: 2 },
      { date: '12 Sep', amount: 910000, orders: 2 }
    ]
  },
  '30d': {
    revenue: 18450000,
    orders: 58,
    aov: 318103,
    successRate: 94.2,
    trend: [
      { date: 'Mgg 1', amount: 3800000, orders: 12 },
      { date: 'Mgg 2', amount: 4600000, orders: 15 },
      { date: 'Mgg 3', amount: 5200000, orders: 17 },
      { date: 'Mgg 4', amount: 4850000, orders: 14 }
    ]
  },
  'month': {
    revenue: 12890000,
    orders: 41,
    aov: 314390,
    successRate: 95.1,
    trend: [
      { date: '01-04 Sep', amount: 2900000, orders: 9 },
      { date: '05-08 Sep', amount: 4100000, orders: 13 },
      { date: '09-12 Sep', amount: 5890000, orders: 19 }
    ]
  }
}

const currentMetrics = computed(() => periodData[selectedPeriod.value])

// Category sales
const categorySales = [
  { name: 'Fashion & Pakaian', percentage: 42, revenue: 2007600, color: 'bg-emerald-500' },
  { name: 'Gadget & Audio', percentage: 33, revenue: 1577400, color: 'bg-blue-500' },
  { name: 'Lifestyle & Rumah', percentage: 18, revenue: 860400, color: 'bg-amber-500' },
  { name: 'Sepatu Pria/Wanita', percentage: 7, revenue: 334600, color: 'bg-purple-500' }
]

// Top selling products
const topProducts = [
  {
    name: 'Smartwatch AMOLED Ultra Thin Titanium',
    category: 'Gadget & Aksesoris',
    unitsSold: 24,
    revenue: 21576000,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=120'
  },
  {
    name: 'Kemeja Linen Oversized Relaxed Fit',
    category: 'Fashion Pria',
    unitsSold: 38,
    revenue: 9462000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120'
  },
  {
    name: 'Wireless Earbuds ANC Active Noise Cancelling',
    category: 'Audio & Gadget',
    unitsSold: 26,
    revenue: 9074000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120'
  },
  {
    name: 'Sepatu Sneaker Retro Running Classic White',
    category: 'Sepatu',
    unitsSold: 18,
    revenue: 8262000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120'
  }
]

const maxTrendAmount = computed(() => {
  return Math.max(...currentMetrics.value.trend.map(t => t.amount))
})

function handleExportCsv() {
  const data = currentMetrics.value.trend.map(t => ({
    Periode: t.date,
    'Jumlah Pesanan': t.orders,
    'Total Pendapatan (Rp)': t.amount
  }))
  exportToCsv(`laporan-keuangan-${selectedPeriod.value}.csv`, data)
  toast.success('Laporan performa berhasil diekspor')
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Laporan & Analitik Penjualan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau pertumbuhan omzet, rincian produk terlaris, dan rasio konversi toko
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Period Switcher -->
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center gap-1">
          <button
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              selectedPeriod === '7d' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            ]"
            @click="selectedPeriod = '7d'"
          >
            7 Hari
          </button>
          <button
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              selectedPeriod === '30d' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            ]"
            @click="selectedPeriod = '30d'"
          >
            30 Hari
          </button>
          <button
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              selectedPeriod === 'month' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            ]"
            @click="selectedPeriod = 'month'"
          >
            Bulan Ini
          </button>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="handleExportCsv"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Ekspor CSV
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="handlePrint"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Laporan
        </button>
      </div>
    </div>

    <!-- KPI Summary Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Omzet Penjualan</span>
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
          {{ formatRupiah(currentMetrics.revenue) }}
        </p>
        <span class="inline-block text-[11px] font-semibold text-emerald-600 mt-2">↑ +14.2% dibanding periode lalu</span>
      </div>

      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pesanan Sukses</span>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
          {{ currentMetrics.orders }} Transaksi
        </p>
        <span class="inline-block text-[11px] font-semibold text-emerald-600 mt-2">↑ +8.5% transaksi selesai</span>
      </div>

      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Rata-rata Order (AOV)</span>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
          {{ formatRupiah(currentMetrics.aov) }}
        </p>
        <span class="inline-block text-[11px] text-gray-400 mt-2">Per keranjang transaksi</span>
      </div>

      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tingkat Pesanan Sukses</span>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
          {{ currentMetrics.successRate }}%
        </p>
        <span class="inline-block text-[11px] text-emerald-600 mt-2">Rasio pembatalan sangat rendah</span>
      </div>
    </div>

    <!-- Trend Chart & Category Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Trend Bar Chart -->
      <div class="lg:col-span-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Tren Penjualan Harian</h2>
          <span class="text-xs text-gray-400 font-medium">Satuan: Rupiah</span>
        </div>

        <!-- Visual Bar Chart -->
        <div class="h-64 flex items-end gap-3 pt-8 pb-2">
          <div
            v-for="(t, idx) in currentMetrics.trend"
            :key="idx"
            class="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
          >
            <!-- Tooltip Amount -->
            <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ formatCompactNumber(t.amount) }}
            </span>

            <!-- Column Bar -->
            <div
              class="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 rounded-t-lg transition-all duration-300 relative group-hover:shadow-lg"
              :style="{ height: `${Math.max(12, (t.amount / maxTrendAmount) * 100)}%` }"
            ></div>

            <!-- Date Label -->
            <span class="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">
              {{ t.date }}
            </span>
          </div>
        </div>
      </div>

      <!-- Category Contribution -->
      <div class="lg:col-span-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 space-y-4">
        <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Kontribusi Kategori</h2>
        
        <div class="space-y-4 pt-2">
          <div v-for="cat in categorySales" :key="cat.name" class="space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span class="text-gray-700 dark:text-gray-300">{{ cat.name }}</span>
              <span class="font-bold text-gray-900 dark:text-gray-100">{{ cat.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div :class="[cat.color, 'h-full rounded-full']" :style="{ width: `${cat.percentage}%` }"></div>
            </div>
            <span class="text-[11px] text-gray-400 block text-right">{{ formatRupiah(cat.revenue) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">
          Produk Paling Laris (Bestseller)
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th class="py-3.5 px-6">Produk</th>
              <th class="py-3.5 px-4">Kategori</th>
              <th class="py-3.5 px-4 text-center">Unit Terjual</th>
              <th class="py-3.5 px-6 text-right">Total Pendapatan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            <tr v-for="p in topProducts" :key="p.name" class="hover:bg-gray-50/75 dark:hover:bg-gray-750/50 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img
                    :src="p.image"
                    :alt="p.name"
                    class="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  />
                  <span class="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">{{ p.name }}</span>
                </div>
              </td>
              <td class="py-4 px-4 text-xs text-gray-500">{{ p.category }}</td>
              <td class="py-4 px-4 text-center font-bold text-gray-900 dark:text-gray-100 text-xs">
                {{ p.unitsSold }} Unit
              </td>
              <td class="py-4 px-6 text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                {{ formatRupiah(p.revenue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
