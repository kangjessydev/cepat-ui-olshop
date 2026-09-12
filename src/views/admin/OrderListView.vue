<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Order } from '@/types'
import { orderRepository } from '@/repositories'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge.vue'
import InvoicePrintModal from '@/components/admin/InvoicePrintModal.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { exportToCsv } from '@/utils/exportCsv'
import { toast } from 'vue-sonner'

const router = useRouter()
const orders = ref<Order[]>([])
const searchQuery = ref('')
const selectedStatus = ref<string>('all')
const selectedCourier = ref<string>('all')

// Print modal
const activePrintOrder = ref<Order | null>(null)
const isPrintModalOpen = ref(false)

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  orders.value = await orderRepository.getAll()
}

// Counts for tabs
const counts = computed(() => {
  const all = orders.value.length
  const pending = orders.value.filter(o => o.status === 'pending_payment').length
  const processing = orders.value.filter(o => o.status === 'processing' || o.status === 'payment_verified').length
  const shipped = orders.value.filter(o => o.status === 'shipped').length
  const delivered = orders.value.filter(o => o.status === 'delivered').length
  const cancelled = orders.value.filter(o => o.status === 'cancelled').length
  return { all, pending, processing, shipped, delivered, cancelled }
})

const tabs = computed(() => [
  { id: 'all', label: 'Semua', count: counts.value.all },
  { id: 'pending_payment', label: 'Menunggu Bayar', count: counts.value.pending },
  { id: 'processing', label: 'Perlu Diproses', count: counts.value.processing },
  { id: 'shipped', label: 'Dikirim', count: counts.value.shipped },
  { id: 'delivered', label: 'Selesai', count: counts.value.delivered },
  { id: 'cancelled', label: 'Dibatalkan', count: counts.value.cancelled }
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Status filter
    if (selectedStatus.value !== 'all') {
      if (selectedStatus.value === 'processing') {
        if (order.status !== 'processing' && order.status !== 'payment_verified') return false
      } else if (order.status !== selectedStatus.value) {
        return false
      }
    }

    // Courier filter
    if (selectedCourier.value !== 'all') {
      if (!order.shipping.courierName.toLowerCase().includes(selectedCourier.value.toLowerCase())) {
        return false
      }
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchOrder = order.orderNumber.toLowerCase().includes(q)
      const matchCust = order.customerName.toLowerCase().includes(q)
      const matchPhone = order.customerPhone.includes(q)
      const matchItem = order.items.some(i => i.productName.toLowerCase().includes(q))
      if (!matchOrder && !matchCust && !matchPhone && !matchItem) return false
    }

    return true
  })
})

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function openPrintModal(order: Order) {
  activePrintOrder.value = order
  isPrintModalOpen.value = true
}

function handleExportCsv() {
  if (filteredOrders.value.length === 0) {
    toast.error('Tidak ada data pesanan untuk diekspor')
    return
  }

  const exportData = filteredOrders.value.map(o => ({
    'No. Pesanan': o.orderNumber,
    'Tanggal': o.createdAt,
    'Nama Pelanggan': o.customerName,
    'Email': o.customerEmail,
    'No. Telepon': o.customerPhone,
    'Status Pesanan': o.status,
    'Subtotal': o.subtotal,
    'Ongkir': o.shippingCost,
    'Diskon': o.discountAmount,
    'Total Pembayaran': o.totalAmount,
    'Metode Bayar': o.payment.method,
    'Status Bayar': o.payment.status,
    'Kurir': o.shipping.courierName,
    'Layanan Kurir': o.shipping.serviceName,
    'Nomor Resi': o.shipping.trackingNumber || '-',
    'Alamat Penerima': `${o.shipping.address.addressLine}, ${o.shipping.address.city}, ${o.shipping.address.province}`
  }))

  const dateStr = new Date().toISOString().split('T')[0]
  exportToCsv(`pesanan-cepat-olshop-${dateStr}.csv`, exportData)
  toast.success('Laporan pesanan berhasil diunduh dalam format CSV')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Pesanan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola transaksi masuk, verifikasi pembayaran, dan input resi pengiriman toko
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl shadow-xs transition-colors"
          @click="handleExportCsv"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Ekspor CSV
        </button>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto pb-1" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'whitespace-nowrap py-3 px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors',
            selectedStatus === tab.id
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
          ]"
          @click="selectedStatus = tab.id"
        >
          {{ tab.label }}
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              selectedStatus === tab.id
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Filter & Search Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
      <!-- Search Input -->
      <div class="sm:col-span-8 relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari no pesanan, nama pembeli, no HP, atau produk..."
          class="block w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        />
      </div>

      <!-- Courier Filter -->
      <div class="sm:col-span-4">
        <select
          v-model="selectedCourier"
          class="block w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-700 dark:text-gray-200"
        >
          <option value="all">Semua Ekspedisi Kurir</option>
          <option value="jne">JNE Express</option>
          <option value="sicepat">SiCepat Express</option>
          <option value="j&t">J&T Express</option>
          <option value="anteraja">AnterAja</option>
          <option value="pos">POS Indonesia</option>
        </select>
      </div>
    </div>

    <!-- Orders Table Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th class="py-3.5 px-4">No. Pesanan & Tanggal</th>
              <th class="py-3.5 px-4">Pembeli</th>
              <th class="py-3.5 px-4">Rincian Item</th>
              <th class="py-3.5 px-4">Total Belanja</th>
              <th class="py-3.5 px-4">Status Pesanan</th>
              <th class="py-3.5 px-4">Pengiriman</th>
              <th class="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-gray-50/75 dark:hover:bg-gray-750/50 transition-colors cursor-pointer"
              @click="router.push(`/admin/orders/${order.id}`)"
            >
              <!-- Order Number & Date -->
              <td class="py-3.5 px-4">
                <span class="font-bold text-gray-900 dark:text-gray-100 hover:text-emerald-600 transition-colors">
                  #{{ order.orderNumber }}
                </span>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {{ formatDate(order.createdAt) }}
                </p>
              </td>

              <!-- Customer Info -->
              <td class="py-3.5 px-4">
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ order.customerName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ order.customerPhone }}</p>
              </td>

              <!-- Items Summary -->
              <td class="py-3.5 px-4 max-w-xs">
                <div class="flex items-center gap-2.5">
                  <img
                    :src="order.items[0]?.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'"
                    :alt="order.items[0]?.productName"
                    class="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-800 flex-shrink-0"
                  />
                  <div class="truncate">
                    <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {{ order.items[0]?.productName }}
                    </p>
                    <p v-if="order.items.length > 1" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      +{{ order.items.length - 1 }} item lainnya
                    </p>
                    <p v-else class="text-[11px] text-gray-400 mt-0.5">
                      x{{ order.items[0]?.quantity }} unit
                    </p>
                  </div>
                </div>
              </td>

              <!-- Total Amount & Payment Badge -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <p class="font-bold text-gray-900 dark:text-gray-100">
                  {{ formatRupiah(order.totalAmount) }}
                </p>
                <span
                  :class="[
                    'inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1',
                    order.payment.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : order.payment.status === 'verification_pending'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                  ]"
                >
                  {{ order.payment.status === 'paid' ? 'Lunas' : order.payment.status === 'verification_pending' ? 'Cek Bukti' : 'Belum Bayar' }}
                </span>
              </td>

              <!-- Status Badge -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <OrderStatusBadge :status="order.status" />
              </td>

              <!-- Shipping Info -->
              <td class="py-3.5 px-4">
                <p class="font-semibold text-xs text-gray-900 dark:text-gray-100 uppercase">
                  {{ order.shipping.courierName }}
                </p>
                <p v-if="order.shipping.trackingNumber" class="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {{ order.shipping.trackingNumber }}
                </p>
                <p v-else class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Belum Ada Resi
                </p>
              </td>

              <!-- Action Buttons -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Print Button -->
                  <button
                    type="button"
                    title="Cetak Faktur / Resi"
                    class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                    @click="openPrintModal(order)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>

                  <!-- View Detail Button -->
                  <button
                    type="button"
                    title="Lihat Detail Pesanan"
                    class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    @click="router.push(`/admin/orders/${order.id}`)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="py-16 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p class="font-medium text-gray-900 dark:text-gray-100">Tidak ada pesanan ditemukan</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status yang dipilih</p>
      </div>
    </div>

    <!-- Print Modal -->
    <InvoicePrintModal
      v-if="activePrintOrder"
      :order="activePrintOrder"
      :is-open="isPrintModalOpen"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>
