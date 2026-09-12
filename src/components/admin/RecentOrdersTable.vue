<template>
  <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Pesanan Terbaru</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Daftar transaksi masuk terkini</p>
      </div>
      <router-link
        to="/admin/orders"
        class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
      >
        Lihat Semua <ArrowRight :size="13" />
      </router-link>
    </div>

    <div class="overflow-x-auto -mx-5 px-5">
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-medium">
            <th class="pb-3">No. Order</th>
            <th class="pb-3">Pelanggan</th>
            <th class="pb-3">Status</th>
            <th class="pb-3 text-right">Total</th>
            <th class="pb-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group"
          >
            <td class="py-3 font-semibold text-slate-800 dark:text-slate-200">
              {{ order.orderNumber }}
              <span class="block text-[10px] text-slate-400 font-normal">{{ formatDate(order.createdAt) }}</span>
            </td>
            <td class="py-3 text-slate-700 dark:text-slate-300">
              <div class="font-medium">{{ order.customerName }}</div>
              <span class="text-[10px] text-slate-400">{{ order.shipping.courierName }} ({{ order.shipping.serviceName }})</span>
            </td>
            <td class="py-3">
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                  statusBadgeClass(order.status)
                ]"
              >
                {{ statusLabel(order.status) }}
              </span>
            </td>
            <td class="py-3 text-right font-bold text-slate-900 dark:text-white">
              {{ formatRupiah(order.totalAmount) }}
            </td>
            <td class="py-3 text-right">
              <router-link
                :to="`/admin/orders/${order.id}`"
                class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition inline-flex items-center"
                title="Buka Detail Pesanan"
              >
                <Eye :size="15" />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Eye } from '@lucide/vue'
import { formatRupiah } from '@/utils/formatCurrency'
import type { Order, OrderStatus } from '@/types'

interface Props {
  orders: Order[]
}

defineProps<Props>()

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case 'pending_payment':
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50'
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50'
    case 'shipped':
      return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50'
    case 'delivered':
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50'
    case 'cancelled':
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/50'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'pending_payment': return 'Menunggu Bayar'
    case 'processing': return 'Sedang Dikemas'
    case 'shipped': return 'Dalam Pengiriman'
    case 'delivered': return 'Selesai'
    case 'cancelled': return 'Dibatalkan'
    default: return status
  }
}
</script>
