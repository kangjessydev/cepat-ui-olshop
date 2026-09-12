<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '@/types'
import { formatRupiah } from '@/utils/formatCurrency'

const props = defineProps<{
  order: Order
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const printMode = ref<'invoice' | 'label'>('invoice')

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <!-- Modal Container -->
    <div class="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden my-8">
      <!-- Modal Header (Hidden on Print) -->
      <div class="print:hidden flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex items-center gap-2">
          <button
            type="button"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              printMode === 'invoice'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            ]"
            @click="printMode = 'invoice'"
          >
            Faktur / Invoice
          </button>
          <button
            type="button"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              printMode === 'label'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            ]"
            @click="printMode = 'label'"
          >
            Label Pengiriman
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            @click="handlePrint"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Dokumen
          </button>
          <button
            type="button"
            class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Printable Document Area -->
      <div id="printable-content" class="p-8 bg-white text-gray-900 font-sans max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
        
        <!-- ================= INVOICE VIEW ================= -->
        <div v-if="printMode === 'invoice'" class="space-y-6">
          <!-- Store & Invoice Header -->
          <div class="flex items-start justify-between border-b border-gray-200 pb-6">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <h1 class="text-xl font-bold tracking-tight text-gray-900">CEPAT OLSHOP</h1>
              </div>
              <p class="text-xs text-gray-500">Official E-Commerce Store</p>
              <p class="text-xs text-gray-500">Jakarta Selatan, DKI Jakarta</p>
              <p class="text-xs text-gray-500">support@cepatolshop.id • 0812-3456-7890</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 uppercase tracking-wider mb-2">
                INVOICE RESMI
              </span>
              <p class="text-sm font-bold text-gray-900">#{{ order.orderNumber }}</p>
              <p class="text-xs text-gray-500 mt-1">Tanggal: {{ formatDate(order.createdAt) }}</p>
              <p class="text-xs text-gray-500">Status: <span class="font-semibold capitalize">{{ order.status.replace('_', ' ') }}</span></p>
            </div>
          </div>

          <!-- Billing & Shipping Details -->
          <div class="grid grid-cols-2 gap-8 py-2 text-xs">
            <div>
              <p class="font-semibold text-gray-500 uppercase tracking-wider mb-1">Ditujukan Kepada:</p>
              <p class="font-bold text-gray-900 text-sm">{{ order.customerName }}</p>
              <p class="text-gray-600 mt-0.5">{{ order.customerPhone }}</p>
              <p class="text-gray-600">{{ order.customerEmail }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat Pengiriman:</p>
              <p class="font-semibold text-gray-900">{{ order.shipping.address.recipientName }} ({{ order.shipping.address.phone }})</p>
              <p class="text-gray-600 leading-relaxed mt-0.5">
                {{ order.shipping.address.addressLine }}, {{ order.shipping.address.subdistrict }}, {{ order.shipping.address.city }}, {{ order.shipping.address.province }} {{ order.shipping.address.postalCode }}
              </p>
              <p v-if="order.shipping.address.notes" class="text-xs text-amber-700 italic mt-1">
                Catatan: {{ order.shipping.address.notes }}
              </p>
            </div>
          </div>

          <!-- Items Table -->
          <table class="w-full border-collapse text-left text-xs">
            <thead>
              <tr class="border-y border-gray-200 bg-gray-50 font-semibold text-gray-700">
                <th class="py-2.5 px-3">Produk</th>
                <th class="py-2.5 px-3 text-right">Harga Satuan</th>
                <th class="py-2.5 px-3 text-center">Jumlah</th>
                <th class="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in order.items" :key="item.id">
                <td class="py-3 px-3">
                  <p class="font-medium text-gray-900">{{ item.productName }}</p>
                  <p v-if="item.variantDescription" class="text-xs text-gray-500">{{ item.variantDescription }}</p>
                </td>
                <td class="py-3 px-3 text-right text-gray-700">{{ formatRupiah(item.price) }}</td>
                <td class="py-3 px-3 text-center text-gray-700">{{ item.quantity }}</td>
                <td class="py-3 px-3 text-right font-medium text-gray-900">{{ formatRupiah(item.subtotal) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Financial Breakdown -->
          <div class="flex justify-end pt-2">
            <div class="w-64 space-y-1.5 text-xs">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal Produk:</span>
                <span>{{ formatRupiah(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Ongkos Kirim ({{ order.shipping.courierName }}):</span>
                <span>{{ formatRupiah(order.shippingCost) }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-emerald-700 font-medium">
                <span>Diskon Kupon:</span>
                <span>-{{ formatRupiah(order.discountAmount) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
                <span>Total Tagihan:</span>
                <span class="text-emerald-700">{{ formatRupiah(order.totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Details Footer -->
          <div class="border-t border-gray-200 pt-4 flex items-center justify-between text-xs text-gray-500">
            <div>
              <p><span class="font-semibold text-gray-700">Metode Bayar:</span> {{ order.payment.method.toUpperCase() }} - {{ order.payment.bankName || 'Otomatis' }}</p>
              <p><span class="font-semibold text-gray-700">Status Pembayaran:</span> {{ order.payment.status.toUpperCase() }}</p>
            </div>
            <div class="text-right italic">
              Terima kasih telah berbelanja di Cepat Olshop.
            </div>
          </div>
        </div>

        <!-- ================= SHIPPING LABEL VIEW ================= -->
        <div v-else class="max-w-md mx-auto border-2 border-black p-4 space-y-4 rounded-md">
          <!-- Courier Header & Resi -->
          <div class="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <span class="text-xl font-black uppercase tracking-wider">{{ order.shipping.courierName }}</span>
              <p class="text-xs font-bold text-gray-700">{{ order.shipping.serviceName }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-600 uppercase font-semibold">Nomor Resi / AWB</p>
              <p class="text-base font-black tracking-wide font-mono">{{ order.shipping.trackingNumber || 'BELUM DIGENERATE' }}</p>
            </div>
          </div>

          <!-- Barcode placeholder simulation -->
          <div class="text-center py-2 border-b-2 border-black">
            <div class="h-10 flex items-center justify-center gap-1 overflow-hidden px-4">
              <div v-for="i in 42" :key="i" :class="['h-full bg-black', i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-2' : 'w-0.5']"></div>
            </div>
            <p class="text-[10px] font-mono tracking-widest mt-1">#{{ order.orderNumber }}</p>
          </div>

          <!-- Penerima & Pengirim -->
          <div class="space-y-3 text-xs border-b-2 border-black pb-3">
            <div>
              <p class="font-black uppercase text-[11px] text-gray-600">KEPADA PENERIMA:</p>
              <p class="text-sm font-bold">{{ order.shipping.address.recipientName }} ({{ order.shipping.address.phone }})</p>
              <p class="leading-snug mt-1">
                {{ order.shipping.address.addressLine }}, {{ order.shipping.address.subdistrict }}, {{ order.shipping.address.city }}, {{ order.shipping.address.province }} {{ order.shipping.address.postalCode }}
              </p>
              <p v-if="order.shipping.address.notes" class="font-semibold text-amber-900 mt-1">
                Catatan: {{ order.shipping.address.notes }}
              </p>
            </div>

            <div class="pt-2 border-t border-dashed border-gray-400">
              <p class="font-black uppercase text-[11px] text-gray-600">DARI PENGIRIM:</p>
              <p class="font-bold">CEPAT OLSHOP (0812-3456-7890)</p>
              <p>Jakarta Selatan, DKI Jakarta 12430</p>
            </div>
          </div>

          <!-- Paket Item Singkat -->
          <div class="text-xs space-y-1">
            <p class="font-bold uppercase text-[11px] text-gray-600">ISI PAKET ({{ order.items.length }} ITEM):</p>
            <ul class="list-disc list-inside space-y-0.5 text-gray-800">
              <li v-for="item in order.items" :key="item.id">
                {{ item.productName }} (x{{ item.quantity }})
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Modal Footer (Hidden on Print) -->
      <div class="print:hidden px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
        <button
          type="button"
          class="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          @click="emit('close')"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-content, #printable-content * {
    visibility: visible;
  }
  #printable-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
    margin: 0;
  }
}
</style>
