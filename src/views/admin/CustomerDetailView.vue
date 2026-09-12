<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Customer, Order } from '@/types'
import { customersSeed } from '@/mock/customers.seed'
import { ordersSeed } from '@/mock/orders.seed'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const customer = ref<Customer | null>(null)
const customerOrders = ref<Order[]>([])

onMounted(() => {
  loadCustomerData()
})

function loadCustomerData() {
  const customerId = route.params.id as string

  // Load Customers
  const savedCust = localStorage.getItem('cepat_customers')
  let customers: Customer[] = []
  if (savedCust) {
    try {
      customers = JSON.parse(savedCust)
    } catch {
      customers = [...customersSeed]
    }
  } else {
    customers = [...customersSeed]
  }

  const found = customers.find(c => c.id === customerId)
  if (!found) {
    toast.error('Pelanggan tidak ditemukan')
    router.push('/admin/customers')
    return
  }
  customer.value = found

  // Load Customer Orders
  const savedOrders = localStorage.getItem('cepat_orders')
  let allOrders: Order[] = []
  if (savedOrders) {
    try {
      allOrders = JSON.parse(savedOrders)
    } catch {
      allOrders = [...ordersSeed]
    }
  } else {
    allOrders = [...ordersSeed]
  }

  customerOrders.value = allOrders.filter(
    o => o.customerId === customerId || o.customerEmail.toLowerCase() === found.email.toLowerCase()
  )
}

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

function openWhatsApp(phone: string) {
  let clean = phone.replace(/\D/g, '')
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1)
  }
  window.open(`https://wa.me/${clean}?text=Halo%20${encodeURIComponent(customer.value?.name || '')},%20terima%20kasih%20telah%20berbelanja%20di%20Cepat%20Olshop.`, '_blank')
}
</script>

<template>
  <div v-if="customer" class="space-y-6">
    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-xs"
          @click="router.push('/admin/customers')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ customer.name }}</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pelanggan sejak {{ formatDate(customer.createdAt) }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        @click="openWhatsApp(customer.phone)"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        Hubungi WhatsApp
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Transaksi Selesai</span>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ customer.totalOrders }} Pesanan</p>
        </div>
      </div>

      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Akumulasi Belanja</span>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ formatRupiah(customer.totalSpent) }}</p>
        </div>
      </div>

      <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Tier Loyalitas</span>
          <p class="text-xl font-bold text-purple-600 dark:text-purple-400">
            {{ customer.totalSpent > 2000000 ? 'Gold Member' : 'Silver Member' }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Order History -->
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
              Riwayat Pesanan Pelanggan ({{ customerOrders.length }})
            </h2>
          </div>

          <div v-if="customerOrders.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <th class="py-3 px-6">No. Pesanan</th>
                  <th class="py-3 px-4">Tanggal</th>
                  <th class="py-3 px-4">Total Tagihan</th>
                  <th class="py-3 px-4">Status Pesanan</th>
                  <th class="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                <tr
                  v-for="order in customerOrders"
                  :key="order.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td class="py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                    #{{ order.orderNumber }}
                  </td>
                  <td class="py-4 px-4 text-xs text-gray-500">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                    {{ formatRupiah(order.totalAmount) }}
                  </td>
                  <td class="py-4 px-4">
                    <OrderStatusBadge :status="order.status" />
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button
                      type="button"
                      class="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      @click="router.push(`/admin/orders/${order.id}`)"
                    >
                      Buka Pesanan →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="py-12 text-center text-xs text-gray-400">
            Belum ada pesanan yang tercatat untuk pelanggan ini.
          </div>
        </div>
      </div>

      <!-- Right Column: Profile & Address -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Contact Information -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
            Informasi Kontak
          </h2>
          <div class="space-y-3 text-xs">
            <div>
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Email</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{{ customer.email }}</p>
            </div>
            <div>
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Nomor WhatsApp / HP</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{{ customer.phone }}</p>
            </div>
            <div>
              <p class="text-gray-400 uppercase text-[10px] font-semibold">Tanggal Mendaftar</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{{ formatDate(customer.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Saved Addresses -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h2 class="font-bold text-gray-900 dark:text-gray-100 text-sm">
            Alamat Pengiriman ({{ customer.addresses?.length || 0 }})
          </h2>

          <div
            v-for="(addr, idx) in customer.addresses"
            :key="idx"
            class="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 text-xs space-y-1"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900 dark:text-gray-100">{{ addr.recipientName }}</span>
              <span v-if="idx === (customer.defaultAddressIndex ?? 0)" class="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                Alamat Utama
              </span>
            </div>
            <p class="text-gray-500">{{ addr.phone }}</p>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ addr.addressLine }}, {{ addr.subdistrict }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
            </p>
            <p v-if="addr.notes" class="text-amber-600 dark:text-amber-400 italic">
              Catatan: {{ addr.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
