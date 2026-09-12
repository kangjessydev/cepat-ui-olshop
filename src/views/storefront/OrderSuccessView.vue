<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Order } from '@/types'
import { orderRepository } from '@/repositories'
import { formatRupiah } from '@/utils/formatCurrency'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { CheckCircle2, Copy, Upload, ExternalLink } from '@lucide/vue'

const route = useRoute()
const router = useRouter()

useSeo({
  title: 'Pesanan Berhasil Dibuat',
  description: 'Terima kasih atas pesanan Anda. Segera selesaikan pembayaran untuk diproses.'
})

const order = ref<Order | null>(null)
const proofUrlInput = ref('')
const isUploadingProof = ref(false)

onMounted(async () => {
  await loadOrder()
})

async function loadOrder() {
  const id = route.params.id as string
  const orders = await orderRepository.getAll()
  const found = orders.find(o => o.id === id || o.orderNumber === id)
  if (found) {
    order.value = found
  } else {
    toast.error('Pesanan tidak ditemukan')
    router.push('/')
  }
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text)
  toast.success(`${label} berhasil disalin!`)
}

function handleUploadProof() {
  if (!order.value) return
  if (!proofUrlInput.value.trim()) {
    toast.error('Masukkan URL bukti transfer atau foto struk')
    return
  }

  isUploadingProof.value = true

  const updated: Order = {
    ...order.value,
    payment: {
      ...order.value.payment,
      proofImage: proofUrlInput.value.trim(),
      status: 'verification_pending'
    },
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Bukti Pembayaran Diunggah',
        description: 'Pelanggan telah mengirimkan bukti transfer pembayaran',
        timestamp: new Date().toISOString(),
        status: order.value.status,
        actor: 'customer'
      },
      ...order.value.timeline
    ]
  }

  // Update in localStorage
  const saved = localStorage.getItem('cepat_olshop_orders') || localStorage.getItem('cepat_orders')
  let orders: Order[] = []
  if (saved) orders = JSON.parse(saved)
  const idx = orders.findIndex(o => o.id === updated.id)
  if (idx !== -1) orders[idx] = updated
  localStorage.setItem('cepat_olshop_orders', JSON.stringify(orders))
  localStorage.setItem('cepat_orders', JSON.stringify(orders))

  order.value = updated
  isUploadingProof.value = false
  toast.success('Bukti pembayaran berhasil diunggah dan sedang diverifikasi oleh admin toko!')
}
</script>

<template>
  <div v-if="order" class="max-w-2xl mx-auto px-4 py-12 space-y-8">
    
    <!-- Success Celebration Card -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/20">
        <CheckCircle2 :size="36" />
      </div>

      <div class="space-y-1">
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Transaksi Berhasil Dibuat</span>
        <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100">
          Terima Kasih, {{ order.customerName }}!
        </h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Pesanan Anda telah kami terima dan akan segera diproses setelah pembayaran terverifikasi.
        </p>
      </div>

      <!-- Order Number Badge with Copy -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
        <span class="text-xs text-gray-400 font-mono">No. Pesanan:</span>
        <span class="text-sm font-black text-gray-900 dark:text-gray-100 font-mono">#{{ order.orderNumber }}</span>
        <button
          type="button"
          class="text-gray-400 hover:text-emerald-600"
          title="Salin No Pesanan"
          @click="copyText(order.orderNumber, 'Nomor pesanan')"
        >
          <Copy :size="14" />
        </button>
      </div>
    </div>

    <!-- Xendit Payment Gateway Card (if provider is Xendit) -->
    <div
      v-if="order.payment.provider === 'xendit'"
      class="bg-white dark:bg-gray-800 rounded-3xl border border-blue-100 dark:border-blue-900/40 p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-gray-100">Pembayaran Online (Xendit)</h2>
          <p class="text-xs text-gray-400 mt-0.5">Selesaikan pembayaran secara otomatis tanpa perlu kirim bukti transfer manual.</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
          Otomatis
        </span>
      </div>

      <!-- Total Amount -->
      <div class="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-[11px] text-gray-500 font-medium">Total Tagihan:</span>
          <p class="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
            {{ formatRupiah(order.totalAmount) }}
          </p>
        </div>
        <button
          type="button"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          @click="copyText(String(order.totalAmount), 'Nominal tagihan')"
        >
          Salin Nominal
        </button>
      </div>

      <!-- Virtual Account Details (if VA) -->
      <div v-if="order.payment.accountNumber" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Tipe Pembayaran:</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ order.payment.bankName || 'Virtual Account' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Nomor Rekening / VA:</span>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-gray-900 dark:text-gray-100 text-sm">
              {{ order.payment.accountNumber }}
            </span>
            <button
              type="button"
              class="text-blue-600 hover:text-blue-700"
              @click="copyText(order.payment.accountNumber!, 'Nomor rekening')"
            >
              <Copy :size="14" />
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Atas Nama:</span>
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ order.payment.accountName || 'CEPAT OLSHOP' }}</span>
        </div>
      </div>

      <!-- External Checkout URL CTA -->
      <div v-if="order.payment.paymentUrl" class="space-y-3">
        <a
          :href="order.payment.paymentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          <span>Bayar Sekarang di Portal Xendit</span>
          <ExternalLink :size="16" />
        </a>
        <p class="text-[11px] text-center text-gray-400">
          Mendukung QRIS, GoPay, OVO, Dana, ShopeePay, Virtual Account & Kartu Kredit.
        </p>
      </div>
    </div>

    <!-- Transfer Payment Instructions (if Manual Bank Transfer) -->
    <div
      v-else-if="order.payment.method === 'bank_transfer' || (!order.payment.provider || order.payment.provider === 'manual')"
      class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 class="text-base font-bold text-gray-900 dark:text-gray-100">Instruksi Transfer Pembayaran</h2>
        <p class="text-xs text-gray-400 mt-0.5">Silakan lakukan transfer tepat sesuai nominal berikut:</p>
      </div>

      <!-- Amount to Pay -->
      <div class="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between">
        <div>
          <span class="text-[11px] text-gray-500 font-medium">Total yang Harus Ditransfer:</span>
          <p class="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {{ formatRupiah(order.totalAmount) }}
          </p>
        </div>
        <button
          type="button"
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
          @click="copyText(String(order.totalAmount), 'Nominal transfer')"
        >
          Salin Nominal
        </button>
      </div>

      <!-- Bank Account Details -->
      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Bank Tujuan:</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">Bank {{ order.payment.bankName || 'BCA' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Nomor Rekening:</span>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-gray-900 dark:text-gray-100 text-sm">
              {{ order.payment.accountNumber || '8830123456' }}
            </span>
            <button
              type="button"
              class="text-emerald-600 hover:text-emerald-700"
              @click="copyText(order.payment.accountNumber || '8830123456', 'Nomor rekening')"
            >
              <Copy :size="14" />
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Atas Nama:</span>
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ order.payment.accountName || 'PT CEPAT OLSHOP INDONESIA' }}</span>
        </div>
      </div>

      <!-- Upload Proof of Transfer Form -->
      <div class="space-y-3 pt-2">
        <label class="block text-xs font-bold text-gray-900 dark:text-gray-100">
          Unggah Bukti Pembayaran / Struk Transfer
        </label>
        
        <div v-if="order.payment.proofImage" class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-between text-xs">
          <span class="text-emerald-700 font-medium">✓ Bukti transfer telah terkirim</span>
          <a :href="order.payment.proofImage" target="_blank" class="font-bold text-emerald-600 hover:underline">
            Lihat Bukti
          </a>
        </div>

        <div v-else class="flex gap-2">
          <input
            v-model="proofUrlInput"
            type="text"
            placeholder="Masukkan link/URL foto bukti transfer..."
            class="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            @click="handleUploadProof"
          >
            <Upload :size="14" />
            Unggah
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <router-link
        :to="`/tracking`"
        class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold text-center shadow-xs hover:bg-gray-800 transition"
      >
        Lacak Status Pesanan Ini
      </router-link>
      <router-link
        to="/products"
        class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold text-center hover:bg-gray-50 transition"
      >
        Lanjut Belanja →
      </router-link>
    </div>

  </div>
</template>
