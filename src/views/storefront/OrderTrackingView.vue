<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Order } from '@/types'
import { orderRepository } from '@/repositories'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge.vue'
import OrderTimeline from '@/components/admin/OrderTimeline.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { Search, PackageCheck } from '@lucide/vue'

const route = useRoute()

useSeo({
  title: 'Lacak Status Pesanan & Cek Resi',
  description: 'Cek posisi paket pesanan belanja Anda secara real-time dengan memasukkan nomor pesanan.'
})

const queryInput = ref('')
const order = ref<Order | null>(null)
const hasSearched = ref(false)

onMounted(() => {
  if (route.query.orderNumber) {
    queryInput.value = String(route.query.orderNumber)
    handleSearch()
  }
})

async function handleSearch() {
  const q = queryInput.value.trim().toLowerCase()
  if (!q) {
    toast.error('Ketikkan nomor pesanan atau nomor WhatsApp terlebih dahulu')
    return
  }

  hasSearched.value = true

  const cleanQ = q.replace(/^#/, '')
  const orders = await orderRepository.getAll()
  const found = orders.find(
    o =>
      o.orderNumber.toLowerCase() === cleanQ ||
      o.id.toLowerCase() === cleanQ ||
      (o.customerPhone && o.customerPhone.includes(cleanQ)) ||
      (o.shipping.trackingNumber && o.shipping.trackingNumber.toLowerCase() === cleanQ)
  )

  if (found) {
    order.value = found
    toast.success('Pesanan ditemukan!')
  } else {
    order.value = null
    toast.error('Pesanan tidak ditemukan dengan nomor tersebut')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    
    <!-- Header & Search Box -->
    <div class="text-center max-w-xl mx-auto space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
        <PackageCheck :size="24" />
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
        Lacak Pesanan & Cek Resi
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Masukkan nomor pesanan (contoh: <code class="font-bold text-emerald-600">ORD-202609-001</code>) atau nomor HP untuk memeriksa status paket Anda.
      </p>

      <!-- Input Form -->
      <form class="flex gap-2 pt-2" @submit.prevent="handleSearch">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
          <input
            v-model="queryInput"
            type="text"
            placeholder="Ketikkan nomor pesanan (ORD-...) atau no HP..."
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
        <button
          type="submit"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          Lacak
        </button>
      </form>
    </div>

    <!-- Found Order Result -->
    <div v-if="order" class="space-y-6 pt-4">
      
      <!-- Top Card: Summary & Status -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-black text-gray-900 dark:text-gray-100 font-mono">
              #{{ order.orderNumber }}
            </h2>
            <OrderStatusBadge :status="order.status" />
          </div>
          <p class="text-xs text-gray-400 mt-1">
            Penerima: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ order.customerName }}</span> • {{ order.shipping.courierName }} ({{ order.shipping.serviceName }})
          </p>
        </div>

        <div class="text-left sm:text-right">
          <span class="text-xs text-gray-400 block">Nomor Resi / AWB:</span>
          <span v-if="order.shipping.trackingNumber" class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
            {{ order.shipping.trackingNumber }}
          </span>
          <span v-else class="text-xs text-amber-600 italic">
            Belum diterbitkan oleh kurir
          </span>
        </div>
      </div>

      <!-- 2-Column Grid: Timeline & Items -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <!-- Left Column: Timeline -->
        <div class="md:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">
            Riwayat Pengiriman & Status
          </h3>
          <OrderTimeline :events="order.timeline" />
        </div>

        <!-- Right Column: Shipping Destination & Items -->
        <div class="md:col-span-5 space-y-4">
          
          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-3 text-xs">
            <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">
              Alamat Pengiriman
            </h3>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ order.shipping.address.recipientName }}</p>
            <p class="text-gray-500 leading-relaxed">
              {{ order.shipping.address.addressLine }}, {{ order.shipping.address.subdistrict }}, {{ order.shipping.address.city }}, {{ order.shipping.address.province }} {{ order.shipping.address.postalCode }}
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-3 text-xs">
            <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">
              Item Pesanan ({{ order.items.length }})
            </h3>
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
              <div v-for="item in order.items" :key="item.id" class="py-2.5 flex items-center gap-2.5 first:pt-0">
                <img :src="item.productImage" :alt="item.productName" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ item.productName }}</p>
                  <p class="text-[10px] text-gray-400">x{{ item.quantity }} unit</p>
                </div>
                <span class="font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(item.subtotal) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-sm text-gray-900 dark:text-gray-100">
              <span>Total Pembayaran:</span>
              <span class="text-emerald-600">{{ formatRupiah(order.totalAmount) }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- Not Found State -->
    <div v-else-if="hasSearched" class="py-12 text-center text-gray-400 text-xs bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
      Tidak ada data pesanan yang cocok dengan nomor pencarian di atas. Pastikan format nomor pesanan sudah benar (contoh: <code class="font-bold text-gray-600">ORD-202609-001</code>).
    </div>

  </div>
</template>
