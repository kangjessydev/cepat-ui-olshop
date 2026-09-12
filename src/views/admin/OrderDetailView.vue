<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Order } from '@/types'
import { ordersSeed } from '@/mock/orders.seed'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge.vue'
import OrderTimeline from '@/components/admin/OrderTimeline.vue'
import InvoicePrintModal from '@/components/admin/InvoicePrintModal.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)
const internalNoteInput = ref('')
const isPrintModalOpen = ref(false)
const isTrackingModalOpen = ref(false)
const isProofModalOpen = ref(false)

// Input resi form state
const trackingCourier = ref('')
const trackingService = ref('')
const trackingNumberInput = ref('')

onMounted(() => {
  loadOrderDetail()
})

function loadOrderDetail() {
  const orderId = route.params.id as string
  const saved = localStorage.getItem('cepat_orders')
  let orders: Order[] = []
  if (saved) {
    try {
      orders = JSON.parse(saved)
    } catch {
      orders = [...ordersSeed]
    }
  } else {
    orders = [...ordersSeed]
  }

  const found = orders.find(o => o.id === orderId || o.orderNumber === orderId)
  if (found) {
    order.value = found
    internalNoteInput.value = found.internalNotes || ''
    trackingCourier.value = found.shipping.courierName
    trackingService.value = found.shipping.serviceName
    trackingNumberInput.value = found.shipping.trackingNumber || ''
  } else {
    toast.error('Pesanan tidak ditemukan')
    router.push('/admin/orders')
  }
}

function saveOrderToStorage(updatedOrder: Order) {
  const saved = localStorage.getItem('cepat_orders')
  let orders: Order[] = []
  if (saved) {
    try {
      orders = JSON.parse(saved)
    } catch {
      orders = [...ordersSeed]
    }
  }
  const idx = orders.findIndex(o => o.id === updatedOrder.id)
  if (idx !== -1) {
    orders[idx] = updatedOrder
  } else {
    orders.unshift(updatedOrder)
  }
  localStorage.setItem('cepat_orders', JSON.stringify(orders))
  order.value = { ...updatedOrder }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

// Action: Konfirmasi Pembayaran
function handleConfirmPayment() {
  if (!order.value) return
  const now = new Date().toISOString()
  const updated: Order = {
    ...order.value,
    status: 'processing',
    payment: {
      ...order.value.payment,
      status: 'paid',
      confirmedAt: now
    },
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Pembayaran Dikonfirmasi',
        description: 'Admin memverifikasi bukti transfer dan pembayaran diterima',
        timestamp: now,
        status: 'processing',
        actor: 'admin'
      },
      ...order.value.timeline
    ],
    updatedAt: now
  }
  saveOrderToStorage(updated)
  toast.success('Pembayaran pesanan berhasil diverifikasi!')
}

// Action: Simpan Resi & Kirim
function handleSubmitTracking() {
  if (!order.value) return
  if (!trackingNumberInput.value.trim()) {
    toast.error('Nomor resi wajib diisi!')
    return
  }

  const now = new Date().toISOString()
  const updated: Order = {
    ...order.value,
    status: 'shipped',
    shipping: {
      ...order.value.shipping,
      courierName: trackingCourier.value,
      serviceName: trackingService.value,
      trackingNumber: trackingNumberInput.value.trim()
    },
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Paket Sedang Dikirim',
        description: `Diserahkan ke ${trackingCourier.value} dengan No. Resi: ${trackingNumberInput.value.trim()}`,
        timestamp: now,
        status: 'shipped',
        actor: 'admin'
      },
      ...order.value.timeline
    ],
    updatedAt: now
  }
  saveOrderToStorage(updated)
  isTrackingModalOpen.value = false
  toast.success('Resi berhasil disimpan dan status pesanan diperbarui menjadi Dikirim')
}

// Action: Selesaikan Pesanan
function handleCompleteOrder() {
  if (!order.value) return
  const now = new Date().toISOString()
  const updated: Order = {
    ...order.value,
    status: 'delivered',
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Pesanan Selesai / Diterima',
        description: 'Paket telah berhasil diterima oleh pembeli',
        timestamp: now,
        status: 'delivered',
        actor: 'admin'
      },
      ...order.value.timeline
    ],
    updatedAt: now
  }
  saveOrderToStorage(updated)
  toast.success('Pesanan ditandai sebagai selesai!')
}

// Action: Batalkan Pesanan
function handleCancelOrder() {
  if (!order.value) return
  const reason = window.prompt('Masukkan alasan pembatalan pesanan:')
  if (reason === null) return // Canceled dialog

  const now = new Date().toISOString()
  const updated: Order = {
    ...order.value,
    status: 'cancelled',
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Pesanan Dibatalkan',
        description: reason || 'Pesanan dibatalkan oleh admin',
        timestamp: now,
        status: 'cancelled',
        actor: 'admin'
      },
      ...order.value.timeline
    ],
    updatedAt: now
  }
  saveOrderToStorage(updated)
  toast.info('Pesanan telah dibatalkan')
}

// Save Internal Note
function handleSaveNote() {
  if (!order.value) return
  const updated: Order = {
    ...order.value,
    internalNotes: internalNoteInput.value.trim(),
    updatedAt: new Date().toISOString()
  }
  saveOrderToStorage(updated)
  toast.success('Catatan internal toko berhasil disimpan')
}
</script>

<template>
  <div v-if="order" class="space-y-6">
    <!-- Header Navigation & Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-xs"
          @click="router.push('/admin/orders')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              #{{ order.orderNumber }}
            </h1>
            <OrderStatusBadge :status="order.status" />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Dibuat pada {{ formatDate(order.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="isPrintModalOpen = true"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Faktur / Resi
        </button>

        <!-- Dynamic Status Progression Buttons -->
        <button
          v-if="order.status === 'pending_payment'"
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="handleConfirmPayment"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Konfirmasi Pembayaran
        </button>

        <button
          v-if="order.status === 'processing' || order.status === 'payment_verified'"
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="isTrackingModalOpen = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Input Resi & Kirim
        </button>

        <button
          v-if="order.status === 'shipped'"
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          @click="handleCompleteOrder"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tandai Selesai
        </button>

        <button
          v-if="order.status !== 'cancelled' && order.status !== 'delivered'"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl transition-colors"
          @click="handleCancelOrder"
        >
          Batalkan Pesanan
        </button>
      </div>
    </div>

    <!-- Main Content 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column (Items, Payment, Shipping) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Ordered Items Table Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
              Daftar Produk Pesanan ({{ order.items.length }})
            </h2>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <th class="py-3 px-6">Produk</th>
                  <th class="py-3 px-4 text-right">Harga</th>
                  <th class="py-3 px-4 text-center">Jumlah</th>
                  <th class="py-3 px-6 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                <tr v-for="item in order.items" :key="item.id">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <img
                        :src="item.productImage"
                        :alt="item.productName"
                        class="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-800 flex-shrink-0"
                      />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-gray-100">{{ item.productName }}</p>
                        <p v-if="item.variantDescription" class="text-xs text-gray-400 mt-0.5">
                          {{ item.variantDescription }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-right whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                    {{ formatRupiah(item.price) }}
                  </td>
                  <td class="py-4 px-4 text-center whitespace-nowrap text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {{ item.quantity }}
                  </td>
                  <td class="py-4 px-6 text-right whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">
                    {{ formatRupiah(item.subtotal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Summary Breakdown -->
          <div class="border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/40 dark:bg-gray-800/40">
            <div class="max-w-xs ml-auto space-y-2 text-xs">
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total Belanja:</span>
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Ongkos Kirim ({{ order.shipping.courierName }}):</span>
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(order.shippingCost) }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Diskon Kupon Promo:</span>
                <span class="font-medium">-{{ formatRupiah(order.discountAmount) }}</span>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-sm text-gray-900 dark:text-gray-100">
                <span>Total Pembayaran:</span>
                <span class="text-emerald-600 dark:text-emerald-400">{{ formatRupiah(order.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment & Transfer Proof Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm mb-4">
            Informasi Pembayaran
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-2">
              <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500">Metode:</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100 uppercase">{{ order.payment.method }}</span>
              </div>
              <div v-if="order.payment.bankName" class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500">Bank Tujuan:</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100">{{ order.payment.bankName }} ({{ order.payment.accountNumber }})</span>
              </div>
              <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500">Status Pembayaran:</span>
                <span class="font-bold text-emerald-600 uppercase">{{ order.payment.status }}</span>
              </div>
              <div v-if="order.payment.paidAt" class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500">Waktu Bayar:</span>
                <span class="text-gray-700 dark:text-gray-300">{{ formatDate(order.payment.paidAt) }}</span>
              </div>
            </div>

            <!-- Proof Image Preview -->
            <div class="border border-gray-100 dark:border-gray-700 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col justify-center items-center">
              <span class="text-xs font-medium text-gray-500 mb-2">Bukti Pembayaran / Struk Transfer:</span>
              <div v-if="order.payment.proofImage" class="relative group cursor-pointer" @click="isProofModalOpen = true">
                <img
                  :src="order.payment.proofImage"
                  alt="Bukti Transfer"
                  class="h-28 w-44 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs group-hover:opacity-90 transition-opacity"
                />
                <div class="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                  Klik Perbesar
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400 text-xs">
                Belum ada bukti transfer diunggah
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (Customer, Shipping Address, Timeline, Internal Notes) -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Customer & Shipping Destination -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
            Data Pelanggan & Pengiriman
          </h2>

          <div class="text-xs space-y-3">
            <div>
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Nama Pelanggan:</p>
              <p class="font-bold text-gray-900 dark:text-gray-100 text-sm mt-0.5">{{ order.customerName }}</p>
              <p class="text-gray-500 mt-0.5">{{ order.customerEmail }}</p>
              <p class="text-gray-500">{{ order.customerPhone }}</p>
            </div>

            <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Alamat Penerima:</p>
              <p class="font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ order.shipping.address.recipientName }} ({{ order.shipping.address.phone }})</p>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                {{ order.shipping.address.addressLine }}, {{ order.shipping.address.subdistrict }}, {{ order.shipping.address.city }}, {{ order.shipping.address.province }} {{ order.shipping.address.postalCode }}
              </p>
              <p v-if="order.shipping.address.notes" class="text-amber-600 dark:text-amber-400 italic mt-1">
                Catatan: {{ order.shipping.address.notes }}
              </p>
            </div>

            <div class="pt-3 border-t border-gray-100 dark:border-gray-800">
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Ekspedisi & Nomor Resi:</p>
              <div class="flex items-center justify-between mt-1">
                <span class="font-bold text-gray-900 dark:text-gray-100 uppercase">{{ order.shipping.courierName }} ({{ order.shipping.serviceName }})</span>
                <button
                  type="button"
                  class="text-emerald-600 hover:text-emerald-700 font-semibold"
                  @click="isTrackingModalOpen = true"
                >
                  {{ order.shipping.trackingNumber ? 'Ubah' : '+ Input Resi' }}
                </button>
              </div>
              <p v-if="order.shipping.trackingNumber" class="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5">
                {{ order.shipping.trackingNumber }}
              </p>
              <p v-else class="text-gray-400 italic mt-0.5">
                Nomor resi belum dimasukkan
              </p>
            </div>
          </div>
        </div>

        <!-- Internal Notes Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-3">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
            Catatan Internal Toko
          </h2>
          <p class="text-xs text-gray-400">
            Catatan ini hanya dapat dilihat oleh admin toko (tidak terlihat oleh pembeli).
          </p>
          <textarea
            v-model="internalNoteInput"
            rows="3"
            placeholder="Tulis catatan admin di sini, misal: titip bonus stiker..."
            class="block w-full text-xs p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          ></textarea>
          <div class="flex justify-end">
            <button
              type="button"
              class="px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-xs"
              @click="handleSaveNote"
            >
              Simpan Catatan
            </button>
          </div>
        </div>

        <!-- Timeline Audit Trail -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm mb-4">
            Riwayat Status Pesanan
          </h2>
          <OrderTimeline :events="order.timeline" />
        </div>

      </div>
    </div>

    <!-- Modal Input Resi -->
    <div v-if="isTrackingModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">
          Input Nomor Resi Pengiriman
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Masukkan nomor airway bill (AWB) dari ekspedisi yang digunakan untuk mengirim paket pesanan ini.
        </p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Kurir Ekspedisi</label>
            <input
              v-model="trackingCourier"
              type="text"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Layanan Kurir</label>
            <input
              v-model="trackingService"
              type="text"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Resi (AWB)</label>
            <input
              v-model="trackingNumberInput"
              type="text"
              placeholder="Contoh: JT8839201928"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100 font-mono"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="isTrackingModalOpen = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            @click="handleSubmitTracking"
          >
            Simpan & Ubah ke Dikirim
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Enlarge Bukti Transfer -->
    <div
      v-if="isProofModalOpen && order.payment.proofImage"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
      @click="isProofModalOpen = false"
    >
      <div class="max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-2 shadow-2xl">
        <img
          :src="order.payment.proofImage"
          alt="Bukti Transfer Penuh"
          class="max-h-[85vh] w-auto object-contain rounded-xl mx-auto"
        />
      </div>
    </div>

    <!-- Print Modal -->
    <InvoicePrintModal
      :order="order"
      :is-open="isPrintModalOpen"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>
