<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types'
import { productRepository } from '@/repositories'
import ProductCard from '@/components/storefront/ProductCard.vue'
import EmptyState from '@/components/storefront/EmptyState.vue'
import { useSeo } from '@/composables/useSeo'
import { SlidersHorizontal, Search, X } from '@lucide/vue'

const route = useRoute()
const router = useRouter()

useSeo({
  title: 'Katalog Produk — Pilihan Terbaik',
  description: 'Jelajahi seluruh koleksi produk terlengkap dengan penawaran harga terbaik di Cepat Olshop.'
})

const products = ref<Product[]>([])
const selectedCategory = ref<string>('all')
const searchQuery = ref<string>('')
const sortBy = ref<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest')
const minPrice = ref<number | ''>('')
const maxPrice = ref<number | ''>('')
const minRating = ref<number>(0)
const isMobileFilterOpen = ref(false)

// Pagination load more
const displayLimit = ref(8)

onMounted(async () => {
  await loadProducts()
  syncFromUrl()
})

async function loadProducts() {
  products.value = await productRepository.getAll()
}

function syncFromUrl() {
  if (route.query.q) searchQuery.value = String(route.query.q)
  if (route.query.category) selectedCategory.value = String(route.query.category)
  if (route.query.sort) sortBy.value = route.query.sort as any
}

watch(() => route.query, () => {
  syncFromUrl()
})

const categories = computed(() => {
  const cats = new Set<string>()
  products.value.forEach(p => {
    if (p.category?.name) cats.add(p.category.name)
  })
  return Array.from(cats)
})

const filteredProducts = computed(() => {
  let list = products.value.filter(p => {
    // Category
    if (selectedCategory.value !== 'all') {
      if (p.category?.name !== selectedCategory.value) return false
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = p.name.toLowerCase().includes(q)
      const matchCat = (p.category?.name || '').toLowerCase().includes(q)
      const matchDesc = (p.description || '').toLowerCase().includes(q)
      if (!matchName && !matchCat && !matchDesc) return false
    }

    // Price range
    if (minPrice.value !== '' && p.price < Number(minPrice.value)) return false
    if (maxPrice.value !== '' && p.price > Number(maxPrice.value)) return false

    // Rating
    if (minRating.value > 0 && (p.rating || 0) < minRating.value) return false

    return true
  })

  // Sort
  list.sort((a, b) => {
    if (sortBy.value === 'price_asc') return a.price - b.price
    if (sortBy.value === 'price_desc') return b.price - a.price
    if (sortBy.value === 'popular') return (b.soldCount || 0) - (a.soldCount || 0)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return list
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value)
})

const hasMore = computed(() => {
  return displayLimit.value < filteredProducts.value.length
})

function loadMore() {
  displayLimit.value += 4
}

function resetFilters() {
  selectedCategory.value = 'all'
  searchQuery.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  minRating.value = 0
  sortBy.value = 'newest'
  router.replace({ path: '/products' })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    
    <!-- Breadcrumbs & Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <router-link to="/" class="hover:text-emerald-600 transition">Beranda</router-link>
          <span>/</span>
          <span class="text-gray-700 dark:text-gray-300 font-medium">Katalog Produk</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Semua Produk
          <span class="text-sm font-normal text-gray-400 ml-2">({{ filteredProducts.length }} produk ditemukan)</span>
        </h1>
      </div>

      <!-- Controls: Filter Mobile Toggle + Sort Dropdown -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="sm:hidden inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold shadow-xs"
          @click="isMobileFilterOpen = true"
        >
          <SlidersHorizontal :size="14" />
          Filter
        </button>

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 hidden sm:inline">Urutkan:</span>
          <select
            v-model="sortBy"
            class="py-2 px-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Produk Terbaru</option>
            <option value="popular">Paling Banyak Terjual</option>
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Sidebar: Filter Panel (Desktop) -->
      <aside class="hidden lg:block lg:col-span-3 space-y-6 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">Filter Produk</h3>
          <button
            type="button"
            class="text-xs text-emerald-600 hover:underline font-semibold"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>

        <!-- Search in Catalog -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Cari Kata Kunci</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="14" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Kemeja, smartwatch..."
              class="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Kategori</label>
          <div class="space-y-1.5 text-xs">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="selectedCategory"
                type="radio"
                value="all"
                class="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Semua Kategori</span>
            </label>
            <label
              v-for="cat in categories"
              :key="cat"
              class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <input
                v-model="selectedCategory"
                type="radio"
                :value="cat"
                class="text-emerald-600 focus:ring-emerald-500"
              />
              <span>{{ cat }}</span>
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Rentang Harga (Rp)</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <input
              v-model.number="minPrice"
              type="number"
              placeholder="Min"
              class="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
            <input
              v-model.number="maxPrice"
              type="number"
              placeholder="Maks"
              class="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Rating Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Rating Minimal</label>
          <div class="space-y-1.5 text-xs">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="minRating" type="radio" :value="0" class="text-emerald-600" />
              <span>Semua Rating</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="minRating" type="radio" :value="4" class="text-emerald-600" />
              <span class="text-amber-500 font-bold">★★★★☆</span>
              <span>4 Bintang ke atas</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Right Column: Product Cards Grid -->
      <div class="lg:col-span-9 space-y-8">
        
        <!-- Active Filter Pills -->
        <div v-if="selectedCategory !== 'all' || searchQuery" class="flex items-center gap-2 flex-wrap text-xs">
          <span class="text-gray-400">Filter aktif:</span>
          <span
            v-if="selectedCategory !== 'all'"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
          >
            Kategori: {{ selectedCategory }}
            <button type="button" @click="selectedCategory = 'all'"><X :size="12" /></button>
          </span>
          <span
            v-if="searchQuery"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
          >
            Pencarian: "{{ searchQuery }}"
            <button type="button" @click="searchQuery = ''"><X :size="12" /></button>
          </span>
        </div>

        <!-- Grid of Product Cards -->
        <div v-if="displayedProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <ProductCard
            v-for="prod in displayedProducts"
            :key="prod.id"
            :product="prod"
          />
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          title="Tidak ada produk yang cocok"
          description="Coba ubah kata kunci pencarian atau sesuaikan batas harga dan filter kategori yang dipilih."
          cta-text="Reset Semua Filter"
          cta-link="/products"
          @click="resetFilters"
        />

        <!-- Load More Button -->
        <div v-if="hasMore" class="text-center pt-4">
          <button
            type="button"
            class="px-6 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs transition transform active:scale-95"
            @click="loadMore"
          >
            Muat Lebih Banyak Produk
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Slide-over Filter Drawer -->
    <div v-if="isMobileFilterOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div class="w-80 max-w-full bg-white dark:bg-gray-900 h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">Filter Produk</h3>
          <button type="button" class="p-1 text-gray-400" @click="isMobileFilterOpen = false">
            <X :size="20" />
          </button>
        </div>

        <!-- Category in Mobile -->
        <div class="space-y-2 text-xs">
          <label class="block font-bold text-gray-900 dark:text-gray-100">Kategori</label>
          <div class="space-y-1.5">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="selectedCategory" type="radio" value="all" class="text-emerald-600" />
              <span>Semua Kategori</span>
            </label>
            <label v-for="cat in categories" :key="cat" class="flex items-center gap-2 cursor-pointer">
              <input v-model="selectedCategory" type="radio" :value="cat" class="text-emerald-600" />
              <span>{{ cat }}</span>
            </label>
          </div>
        </div>

        <!-- Price in Mobile -->
        <div class="space-y-2 text-xs">
          <label class="block font-bold text-gray-900 dark:text-gray-100">Rentang Harga (Rp)</label>
          <div class="grid grid-cols-2 gap-2">
            <input v-model.number="minPrice" type="number" placeholder="Min" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200" />
            <input v-model.number="maxPrice" type="number" placeholder="Maks" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200" />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button
            type="button"
            class="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
            @click="resetFilters"
          >
            Reset
          </button>
          <button
            type="button"
            class="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl"
            @click="isMobileFilterOpen = false"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
