<template>
  <div class="space-y-6 pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Manajemen Produk</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">Kelola katalog, harga, stok, dan varian produk toko Anda</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="exportProducts"
          class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Download :size="15" /> Export CSV
        </button>

        <router-link
          to="/admin/products/create"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus :size="16" /> Tambah Produk
        </router-link>
      </div>
    </div>

    <!-- Filter Tabs & Search -->
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- Status Tabs -->
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto text-xs">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer',
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ tab.label }} ({{ tab.count }})
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="15" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk atau SKU..."
            class="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <!-- Products Table -->
      <div class="overflow-x-auto -mx-4 px-4">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-medium">
              <th class="pb-3 pl-2">Produk</th>
              <th class="pb-3">SKU</th>
              <th class="pb-3">Kategori</th>
              <th class="pb-3 text-right">Harga</th>
              <th class="pb-3 text-center">Stok</th>
              <th class="pb-3 text-center">Terjual</th>
              <th class="pb-3 text-right pr-2">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group"
            >
              <td class="py-3 pl-2">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div class="min-w-0 max-w-xs sm:max-w-md">
                    <p class="font-bold text-slate-900 dark:text-white truncate">
                      {{ product.name }}
                    </p>
                    <span v-if="product.hasVariants" class="text-[10px] text-emerald-600 dark:text-emerald-400">
                      {{ product.variantMatrix?.length || 0 }} Varian Kombinasi
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-3 font-mono text-slate-500 text-[11px]">{{ product.sku }}</td>
              <td class="py-3 text-slate-600 dark:text-slate-400">{{ product.category?.name }}</td>
              <td class="py-3 text-right font-bold text-slate-900 dark:text-white">
                <div>{{ formatRupiah(product.price) }}</div>
                <div v-if="product.originalPrice" class="text-[10px] text-slate-400 line-through">
                  {{ formatRupiah(product.originalPrice) }}
                </div>
              </td>
              <td class="py-3 text-center">
                <StockIndicator :stock="product.stock" />
              </td>
              <td class="py-3 text-center font-medium text-slate-600 dark:text-slate-400">
                {{ product.soldCount }} pcs
              </td>
              <td class="py-3 text-right pr-2">
                <div class="flex items-center justify-end gap-1">
                  <router-link
                    :to="`/admin/products/${product.id}/edit`"
                    class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Produk"
                  >
                    <Edit :size="15" />
                  </router-link>
                  <button
                    @click="deleteProduct(product.id)"
                    class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                Tidak ada produk yang cocok dengan filter atau pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Download, Search, Edit, Trash2 } from '@lucide/vue'
import { getMockProducts, saveMockProducts } from '@/mock'
import { formatRupiah } from '@/utils/formatCurrency'
import { exportToCsv } from '@/utils/exportCsv'
import { useToast } from '@/composables/useToast'
import StockIndicator from '@/components/admin/StockIndicator.vue'
import type { Product } from '@/types'

const toast = useToast()
const products = ref<Product[]>(getMockProducts())
const searchQuery = ref('')
type TabType = 'all' | 'active' | 'low_stock' | 'out_of_stock'
const activeTab = ref<TabType>('all')

const statusTabs = computed<{ id: TabType; label: string; count: number }[]>(() => [
  { id: 'all', label: 'Semua', count: products.value.length },
  { id: 'active', label: 'Aktif', count: products.value.filter(p => p.stock > 0).length },
  { id: 'low_stock', label: 'Stok Kritis', count: products.value.filter(p => p.stock > 0 && p.stock <= 5).length },
  { id: 'out_of_stock', label: 'Habis', count: products.value.filter(p => p.stock === 0).length }
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Tab filter
    if (activeTab.value === 'active' && p.stock === 0) return false
    if (activeTab.value === 'low_stock' && (p.stock > 5 || p.stock === 0)) return false
    if (activeTab.value === 'out_of_stock' && p.stock > 0) return false

    // Search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = p.name.toLowerCase().includes(q)
      const matchSku = p.sku.toLowerCase().includes(q)
      const matchCategory = p.category?.name.toLowerCase().includes(q)
      return matchName || matchSku || matchCategory
    }
    return true
  })
})

function deleteProduct(id: string) {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    products.value = products.value.filter(p => p.id !== id)
    saveMockProducts(products.value)
    toast.success('Produk berhasil dihapus')
  }
}

function exportProducts() {
  exportToCsv('daftar-produk-olshop', products.value, [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Nama Produk' },
    { key: 'category', label: 'Kategori', formatter: (val) => val?.name || '' },
    { key: 'price', label: 'Harga (Rp)' },
    { key: 'stock', label: 'Stok' },
    { key: 'soldCount', label: 'Terjual' },
    { key: 'status', label: 'Status' },
  ])
  toast.success('Data produk berhasil diekspor ke CSV')
}
</script>
