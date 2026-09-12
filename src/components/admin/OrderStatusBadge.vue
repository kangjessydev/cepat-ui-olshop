<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition',
      statusClasses
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', dotClass]" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'

interface Props {
  status: OrderStatus
}

const props = defineProps<Props>()

const statusClasses = computed(() => {
  switch (props.status) {
    case 'pending_payment':
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60'
    case 'payment_verified':
    case 'processing':
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/60'
    case 'shipped':
      return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/60'
    case 'delivered':
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60'
    case 'cancelled':
      return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'pending_payment': return 'bg-amber-500'
    case 'payment_verified':
    case 'processing': return 'bg-blue-500'
    case 'shipped': return 'bg-indigo-500'
    case 'delivered': return 'bg-emerald-500'
    case 'cancelled': return 'bg-rose-500'
    default: return 'bg-slate-400'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'pending_payment': return 'Menunggu Bayar'
    case 'payment_verified': return 'Bayar Terverifikasi'
    case 'processing': return 'Sedang Dikemas'
    case 'shipped': return 'Dalam Pengiriman'
    case 'delivered': return 'Pesanan Selesai'
    case 'cancelled': return 'Dibatalkan'
    default: return props.status
  }
})
</script>
