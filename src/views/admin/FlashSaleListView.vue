<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FlashSaleEvent, FlashSaleItem, Product } from '@/types'
import { flashSaleSeed } from '@/mock/vouchers.seed'
import { productRepository } from '@/repositories'
import { formatRupiah } from '@/utils/formatCurrency'
import { toast } from 'vue-sonner'

const flashSale = ref<FlashSaleEvent>({ ...flashSaleSeed })
const allProducts = ref<Product[]>([])

const isAddItemModalOpen = ref(false)
const selectedProductId = ref('')
const itemFlashPrice = ref(0)
const itemStockQuota = ref(20)

onMounted(async () => {
  loadFlashSale()
  await loadCatalogProducts()
})

function loadFlashSale() {
  const saved = localStorage.getItem('cepat_flash_sale')
  if (saved) {
    try {
      flashSale.value = JSON.parse(saved)
    } catch {
      flashSale.value = { ...flashSaleSeed }
    }
  } else {
    flashSale.value = { ...flashSaleSeed }
    localStorage.setItem('cepat_flash_sale', JSON.stringify(flashSaleSeed))
  }
}

async function loadCatalogProducts() {
  allProducts.value = await productRepository.getAll()
}

function saveFlashSale() {
  localStorage.setItem('cepat_flash_sale', JSON.stringify(flashSale.value))
}

function toggleStatus() {
  flashSale.value.isActive = !flashSale.value.isActive
  saveFlashSale()
  toast.success(`Flash Sale ${flashSale.value.isActive ? 'diaktifkan' : 'dinonaktifkan'}`)
}

function toggleShowOnHome() {
  flashSale.value.showOnHome = !flashSale.value.showOnHome
  saveFlashSale()
  toast.success(`Tampilan di Homepage ${flashSale.value.showOnHome ? 'diaktifkan' : 'disembunyikan'}`)
}

function openAddItemModal() {
  selectedProductId.value = ''
  itemFlashPrice.value = 0
  itemStockQuota.value = 20
  isAddItemModalOpen.value = true
}

function onSelectProductChange() {
  const prod = allProducts.value.find(p => p.id === selectedProductId.value)
  if (prod) {
    // Default 20% discount
    itemFlashPrice.value = Math.round(prod.price * 0.8)
  }
}

const calculatedDiscountPercent = computed(() => {
  const prod = allProducts.value.find(p => p.id === selectedProductId.value)
  if (!prod || prod.price <= 0 || itemFlashPrice.value <= 0) return 0
  const diff = prod.price - itemFlashPrice.value
  return Math.round((diff / prod.price) * 100)
})

function handleAddItem() {
  const prod = allProducts.value.find(p => p.id === selectedProductId.value)
  if (!prod) {
    toast.error('Pilih produk terlebih dahulu')
    return
  }

  if (itemFlashPrice.value <= 0 || itemFlashPrice.value >= prod.price) {
    toast.error('Harga flash sale harus lebih murah dari harga normal')
    return
  }

  // Check if exists
  const existing = flashSale.value.items.find(i => i.productId === prod.id)
  if (existing) {
    existing.flashPrice = itemFlashPrice.value
    existing.stockQuota = itemStockQuota.value
    existing.discountPercent = calculatedDiscountPercent.value
    toast.success('Produk flash sale diperbarui')
  } else {
    const newItem: FlashSaleItem = {
      productId: prod.id,
      productName: prod.name,
      productImage: prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      originalPrice: prod.price,
      flashPrice: itemFlashPrice.value,
      discountPercent: calculatedDiscountPercent.value,
      stockQuota: itemStockQuota.value,
      soldQuota: 0
    }
    flashSale.value.items.push(newItem)
    toast.success('Produk berhasil ditambahkan ke sesi Flash Sale')
  }

  saveFlashSale()
  isAddItemModalOpen.value = false
}

function removeItem(productId: string) {
  flashSale.value.items = flashSale.value.items.filter(i => i.productId !== productId)
  saveFlashSale()
  toast.success('Produk dihapus dari Flash Sale')
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
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
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Super Flash Sale</h1>
          <span
            :class="[
              'px-2.5 py-0.5 text-xs font-bold rounded-full',
              flashSale.isActive
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ flashSale.isActive ? 'Sedang Berlangsung' : 'Non-Aktif' }}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola program promo terbatas waktu, diskon kilat, kuota produk flash sale, dan banner storefront
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          @click="openAddItemModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk Flash Sale
        </button>
      </div>
    </div>

    <!-- Campaign Overview Card -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Nama Kampanye</span>
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ flashSale.name }}</h2>
          <p class="text-xs text-gray-500 mt-1">
            Periode: <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatDate(flashSale.startDate) }} s/d {{ formatDate(flashSale.endDate) }}</span>
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tampil di Beranda</label>
            <button
              type="button"
              :class="[
                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                flashSale.showOnHome ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
              ]"
              @click="toggleShowOnHome"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                  flashSale.showOnHome ? 'translate-x-4' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Status Aktif</label>
            <button
              type="button"
              :class="[
                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                flashSale.isActive ? 'bg-rose-600' : 'bg-gray-300 dark:bg-gray-700'
              ]"
              @click="toggleStatus"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                  flashSale.isActive ? 'translate-x-4' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <span class="text-xs text-gray-400">Total Produk Ikut Serta</span>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">{{ flashSale.items.length }} Produk</p>
        </div>
        <div>
          <span class="text-xs text-gray-400">Total Kuota Flash Sale</span>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ flashSale.items.reduce((acc, i) => acc + i.stockQuota, 0) }} Unit
          </p>
        </div>
        <div>
          <span class="text-xs text-gray-400">Total Terjual Selama Event</span>
          <p class="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {{ flashSale.items.reduce((acc, i) => acc + i.soldQuota, 0) }} Unit
          </p>
        </div>
      </div>
    </div>

    <!-- Flash Sale Items Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">Daftar Produk Flash Sale</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th class="py-3.5 px-6">Produk</th>
              <th class="py-3.5 px-4 text-right">Harga Asli</th>
              <th class="py-3.5 px-4 text-right">Harga Flash Sale</th>
              <th class="py-3.5 px-4 text-center">Diskon</th>
              <th class="py-3.5 px-4">Progres Penjualan Kuota</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            <tr v-for="item in flashSale.items" :key="item.productId" class="hover:bg-gray-50/75 dark:hover:bg-gray-750/50 transition-colors">
              <!-- Product -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img
                    :src="item.productImage"
                    :alt="item.productName"
                    loading="lazy"
                    class="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-800 flex-shrink-0"
                  />
                  <div>
                    <p class="font-bold text-gray-900 dark:text-gray-100">{{ item.productName }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">ID: {{ item.productId }}</p>
                  </div>
                </div>
              </td>

              <!-- Original Price -->
              <td class="py-4 px-4 text-right whitespace-nowrap text-xs text-gray-400 line-through">
                {{ formatRupiah(item.originalPrice) }}
              </td>

              <!-- Flash Price -->
              <td class="py-4 px-4 text-right whitespace-nowrap font-bold text-rose-600 dark:text-rose-400">
                {{ formatRupiah(item.flashPrice) }}
              </td>

              <!-- Discount % -->
              <td class="py-4 px-4 text-center whitespace-nowrap">
                <span class="inline-block px-2 py-0.5 text-xs font-extrabold rounded-md bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  -{{ item.discountPercent }}%
                </span>
              </td>

              <!-- Quota Bar -->
              <td class="py-4 px-4 whitespace-nowrap text-xs">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ item.soldQuota }} terjual</span>
                  <span class="text-gray-400">Kuota: {{ item.stockQuota }}</span>
                </div>
                <div class="w-36 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-rose-500 h-full rounded-full transition-all"
                    :style="{ width: `${Math.min(100, (item.soldQuota / item.stockQuota) * 100)}%` }"
                  ></div>
                </div>
              </td>

              <!-- Action -->
              <td class="py-4 px-6 text-right whitespace-nowrap">
                <button
                  type="button"
                  class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                  title="Hapus dari Flash Sale"
                  @click="removeItem(item.productId)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="flashSale.items.length === 0" class="py-12 text-center text-xs text-gray-400">
        Belum ada produk dimasukkan ke sesi Flash Sale ini.
      </div>
    </div>

    <!-- Modal Add Item -->
    <div v-if="isAddItemModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">
          Tambah Produk ke Flash Sale
        </h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Produk</label>
            <select
              v-model="selectedProductId"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              @change="onSelectProductChange"
            >
              <option value="" disabled>-- Pilih dari Katalog Produk --</option>
              <option v-for="p in allProducts" :key="p.id" :value="p.id">
                {{ p.name }} ({{ formatRupiah(p.price) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Harga Khusus Flash Sale (Rp) *</label>
            <input
              v-model.number="itemFlashPrice"
              type="number"
              min="1000"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-rose-600 text-gray-900 dark:text-gray-100"
            />
            <p v-if="calculatedDiscountPercent > 0" class="text-emerald-600 font-semibold mt-1">
              Diskon didapat: {{ calculatedDiscountPercent }}%
            </p>
          </div>

          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Kuota Stok Flash Sale *</label>
            <input
              v-model.number="itemStockQuota"
              type="number"
              min="1"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="isAddItemModalOpen = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            @click="handleAddItem"
          >
            Simpan ke Flash Sale
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
