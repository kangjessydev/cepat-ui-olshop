<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Customer } from '@/types'
import { customerRepository } from '@/repositories'
import { formatRupiah } from '@/utils/formatCurrency'
import { exportToCsv } from '@/utils/exportCsv'
import { toast } from 'vue-sonner'

const router = useRouter()
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const sortBy = ref<'spent_desc' | 'orders_desc' | 'newest'>('spent_desc')

onMounted(async () => {
  await loadCustomers()
})

async function loadCustomers() {
  customers.value = await customerRepository.getAll()
}

const stats = computed(() => {
  const total = customers.value.length
  const totalRevenue = customers.value.reduce((acc, c) => acc + (c.totalSpent || 0), 0)
  const avgSpent = total > 0 ? totalRevenue / total : 0
  return { total, totalRevenue, avgSpent }
})

const filteredCustomers = computed(() => {
  let result = customers.value.filter(c => {
    if (!searchQuery.value.trim()) return true
    const q = searchQuery.value.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    )
  })

  return result.sort((a, b) => {
    if (sortBy.value === 'spent_desc') return b.totalSpent - a.totalSpent
    if (sortBy.value === 'orders_desc') return b.totalOrders - a.totalOrders
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function handleExportCsv() {
  if (filteredCustomers.value.length === 0) {
    toast.error('Tidak ada data pelanggan untuk diekspor')
    return
  }

  const data = filteredCustomers.value.map(c => ({
    'ID Pelanggan': c.id,
    'Nama': c.name,
    'Email': c.email,
    'Nomor Telepon': c.phone,
    'Total Pesanan': c.totalOrders,
    'Total Belanja (Rp)': c.totalSpent,
    'Kota': c.addresses?.[0]?.city || '-',
    'Provinsi': c.addresses?.[0]?.province || '-',
    'Tanggal Daftar': c.createdAt
  }))

  const dateStr = new Date().toISOString().split('T')[0]
  exportToCsv(`pelanggan-cepat-olshop-${dateStr}.csv`, data)
  toast.success('Data pelanggan berhasil diekspor ke CSV')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Pelanggan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Daftar pembeli terdaftar, riwayat transaksi, dan loyalitas belanja
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        @click="handleExportCsv"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Ekspor CSV
      </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pelanggan</span>
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{{ stats.total }} Orang</p>
      </div>
      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Transaksi Pelanggan</span>
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ formatRupiah(stats.totalRevenue) }}</p>
      </div>
      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Rata-rata Belanja per Pelanggan</span>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ formatRupiah(stats.avgSpent) }}</p>
      </div>
    </div>

    <!-- Search & Sort Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
      <div class="sm:col-span-8 relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pelanggan berdasarkan nama, email, atau nomor HP..."
          class="block w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        />
      </div>
      <div class="sm:col-span-4">
        <select
          v-model="sortBy"
          class="block w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 dark:text-gray-200"
        >
          <option value="spent_desc">Total Belanja Tertinggi</option>
          <option value="orders_desc">Jumlah Pesanan Terbanyak</option>
          <option value="newest">Pelanggan Terbaru</option>
        </select>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th class="py-3.5 px-6">Pelanggan</th>
              <th class="py-3.5 px-4">Kontak</th>
              <th class="py-3.5 px-4">Kota Domisili</th>
              <th class="py-3.5 px-4 text-center">Total Pesanan</th>
              <th class="py-3.5 px-4 text-right">Total Belanja</th>
              <th class="py-3.5 px-4">Bergabung</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            <tr
              v-for="customer in filteredCustomers"
              :key="customer.id"
              class="hover:bg-gray-50/75 dark:hover:bg-gray-750/50 transition-colors cursor-pointer"
              @click="router.push(`/admin/customers/${customer.id}`)"
            >
              <!-- Avatar & Name -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img
                    :src="customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=10b981&color=fff`"
                    :alt="customer.name"
                    loading="lazy"
                    class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  />
                  <div>
                    <p class="font-bold text-gray-900 dark:text-gray-100 hover:text-emerald-600 transition-colors">
                      {{ customer.name }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ customer.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Phone -->
              <td class="py-4 px-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                {{ customer.phone }}
              </td>

              <!-- City / Province -->
              <td class="py-4 px-4 text-xs text-gray-600 dark:text-gray-400">
                {{ customer.addresses?.[0]?.city || '-' }}, {{ customer.addresses?.[0]?.province || '-' }}
              </td>

              <!-- Total Orders Badge -->
              <td class="py-4 px-4 text-center">
                <span class="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {{ customer.totalOrders }} Pesanan
                </span>
              </td>

              <!-- Total Spend -->
              <td class="py-4 px-4 text-right whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">
                {{ formatRupiah(customer.totalSpent) }}
              </td>

              <!-- Joined Date -->
              <td class="py-4 px-4 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {{ formatDate(customer.createdAt) }}
              </td>

              <!-- Action -->
              <td class="py-4 px-6 text-right" @click.stop>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 dark:bg-gray-700 dark:hover:bg-emerald-900/30 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
                  @click="router.push(`/admin/customers/${customer.id}`)"
                >
                  Lihat Profil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCustomers.length === 0" class="py-16 text-center">
        <p class="font-medium text-gray-900 dark:text-gray-100">Tidak ada pelanggan ditemukan</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coba gunakan kata kunci pencarian lainnya</p>
      </div>
    </div>
  </div>
</template>
