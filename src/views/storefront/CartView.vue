<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { voucherRepository } from '@/repositories'
import CartItemRow from '@/components/storefront/CartItemRow.vue'
import EmptyState from '@/components/storefront/EmptyState.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { ArrowRight, Tag, X } from '@lucide/vue'

const router = useRouter()
const cartStore = useCartStore()

useSeo({
  title: 'Keranjang Belanja',
  description: 'Tinjau pesanan produk Anda sebelum melanjutkan ke proses checkout dan pembayaran.'
})

const voucherCodeInput = ref('')

function handleUpdateQty(id: string, qty: number) {
  cartStore.updateQuantity(id, qty)
}

function handleRemoveItem(id: string) {
  cartStore.removeItem(id)
  toast.info('Item dihapus dari keranjang')
}

async function handleApplyVoucher() {
  const code = voucherCodeInput.value.trim().toUpperCase()
  if (!code) {
    toast.error('Masukkan kode voucher terlebih dahulu')
    return
  }

  const found = await voucherRepository.getByCode(code)
  if (!found || !found.isActive) {
    toast.error('Kode voucher tidak valid atau sudah kedaluwarsa')
    return
  }

  try {
    cartStore.applyVoucher(found)
    voucherCodeInput.value = ''
    toast.success(`Voucher "${found.code}" berhasil diterapkan!`)
  } catch (err: any) {
    toast.error(err.message || 'Gagal menerapkan voucher')
  }
}

function handleRemoveVoucher() {
  cartStore.removeVoucher()
  toast.info('Voucher telah dibatalkan')
}

function proceedToCheckout() {
  if (cartStore.items.length === 0) {
    toast.error('Keranjang belanja Anda masih kosong')
    return
  }
  router.push('/checkout')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Keranjang Belanja
        <span class="text-sm font-normal text-gray-400 ml-2">({{ cartStore.totalItemsCount }} barang)</span>
      </h1>
    </div>

    <!-- If Cart has items -->
    <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Item List -->
      <div class="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700/60">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Produk</span>
          <button
            type="button"
            class="text-xs text-rose-500 hover:text-rose-600 font-medium"
            @click="cartStore.clearCart"
          >
            Kosongkan Keranjang
          </button>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <CartItemRow
            v-for="item in cartStore.items"
            :key="item.id"
            :item="item"
            @update-qty="handleUpdateQty"
            @remove="handleRemoveItem"
          />
        </div>

        <div class="pt-2">
          <router-link to="/products" class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
            ← Tambah Produk Lainnya
          </router-link>
        </div>
      </div>

      <!-- Right Column: Summary & Voucher Box -->
      <div class="lg:col-span-4 space-y-4">
        
        <!-- Voucher Input Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100">
            <Tag :size="16" class="text-emerald-600" />
            <span>Punya Kode Voucher Promo?</span>
          </div>

          <!-- Active Applied Voucher Badge -->
          <div
            v-if="cartStore.appliedVoucher"
            class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs"
          >
            <div>
              <span class="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{{ cartStore.appliedVoucher.code }}</span>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{{ cartStore.appliedVoucher.title }}</p>
            </div>
            <button
              type="button"
              class="p-1 text-emerald-700 hover:text-rose-600"
              title="Batalkan Voucher"
              @click="handleRemoveVoucher"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Input Voucher -->
          <div v-else class="flex gap-2">
            <input
              v-model="voucherCodeInput"
              type="text"
              placeholder="Contoh: CEPATHEMAT"
              class="flex-1 px-3 py-2 text-xs uppercase font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              class="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-xs"
              @click="handleApplyVoucher"
            >
              Pakai
            </button>
          </div>
          <p class="text-[10px] text-gray-400">
            Coba kode kupon promo: <code class="font-bold text-emerald-600">CEPATHEMAT</code> atau <code class="font-bold text-emerald-600">ONGKIRFREE</code>
          </p>
        </div>

        <!-- Order Summary Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs space-y-4">
          <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-700">
            Ringkasan Belanja
          </h3>

          <div class="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex justify-between">
              <span>Total Harga ({{ cartStore.totalItemsCount }} barang):</span>
              <span class="font-semibold text-gray-900 dark:text-gray-100">{{ formatRupiah(cartStore.subtotal) }}</span>
            </div>

            <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-emerald-600 font-medium">
              <span>Diskon Kupon ({{ cartStore.appliedVoucher?.code }}):</span>
              <span>-{{ formatRupiah(cartStore.discountAmount) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Biaya Ongkos Kirim:</span>
              <span class="text-gray-400 italic">Dihitung saat checkout</span>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-sm text-gray-900 dark:text-gray-100">
              <span>Total Tagihan:</span>
              <span class="text-emerald-600 dark:text-emerald-400 text-base">{{ formatRupiah(cartStore.grandTotal) }}</span>
            </div>
          </div>

          <!-- Checkout CTA Button -->
          <button
            type="button"
            class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-transform transform active:scale-95"
            @click="proceedToCheckout"
          >
            Lanjut ke Checkout
            <ArrowRight :size="16" />
          </button>
        </div>

      </div>

    </div>

    <!-- If Empty Cart -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-xs">
      <EmptyState
        title="Keranjang Belanja Masih Kosong"
        description="Yuk temukan berbagai produk berkualitas impianmu dan masukkan ke keranjang belanja sekarang juga!"
        cta-text="Mulai Belanja"
        cta-link="/products"
      />
    </div>

  </div>
</template>
