<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, FlashSaleEvent, ProductReview } from '@/types'
import { productsSeed } from '@/mock/products.seed'
import { flashSaleSeed } from '@/mock/vouchers.seed'
import { reviewsSeed } from '@/mock/reviews.seed'
import { useStoreSettingsStore } from '@/stores/settings.store'
import ProductCard from '@/components/storefront/ProductCard.vue'
import FlashSaleCountdown from '@/components/storefront/FlashSaleCountdown.vue'
import RatingStars from '@/components/storefront/RatingStars.vue'
import { useSeo } from '@/composables/useSeo'
import { ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw } from '@lucide/vue'

const router = useRouter()
const settingsStore = useStoreSettingsStore()

useSeo({
  title: 'Beranda — Toko Online Cepat & Terpercaya',
  description: 'Belanja aneka produk fashion, gadget, dan kebutuhan gaya hidup berkualitas dengan pengiriman kilat ke seluruh Indonesia.'
})

const products = ref<Product[]>([])
const flashSale = ref<FlashSaleEvent | null>(null)
const reviews = ref<ProductReview[]>([])

onMounted(() => {
  loadData()
})

function loadData() {
  // Products
  const savedProds = localStorage.getItem('cepat_products')
  if (savedProds) {
    try {
      products.value = JSON.parse(savedProds)
    } catch {
      products.value = [...productsSeed]
    }
  } else {
    products.value = [...productsSeed]
  }

  // Flash Sale
  const savedFs = localStorage.getItem('cepat_flash_sale')
  if (savedFs) {
    try {
      flashSale.value = JSON.parse(savedFs)
    } catch {
      flashSale.value = { ...flashSaleSeed }
    }
  } else {
    flashSale.value = { ...flashSaleSeed }
  }

  // Reviews
  const savedRev = localStorage.getItem('cepat_reviews')
  if (savedRev) {
    try {
      reviews.value = JSON.parse(savedRev)
    } catch {
      reviews.value = [...reviewsSeed]
    }
  } else {
    reviews.value = [...reviewsSeed]
  }
}

// Bestseller products (first 4)
const popularProducts = computed(() => {
  return products.value.slice(0, 4)
})

// New arrival products
const newProducts = computed(() => {
  return products.value.slice(4, 8)
})

// Flash sale items transformed to product view
const flashSaleProducts = computed(() => {
  if (!flashSale.value || !flashSale.value.isActive) return []
  return flashSale.value.items
})

const categories = [
  { name: 'Fashion Pria', icon: '👔', count: 18, query: 'Fashion Pria' },
  { name: 'Gadget & Audio', icon: '🎧', count: 12, query: 'Gadget & Audio' },
  { name: 'Lifestyle & Rumah', icon: '☕', count: 9, query: 'Lifestyle & Rumah' },
  { name: 'Sepatu & Sneaker', icon: '👟', count: 14, query: 'Sepatu' }
]

function navigateCategory(catName: string) {
  router.push({ path: '/products', query: { category: catName } })
}
</script>

<template>
  <div class="space-y-12 sm:space-y-16 pb-16">
    
    <!-- Hero Banner Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-gray-900 to-gray-950 text-white min-h-[380px] sm:min-h-[440px] flex items-center shadow-xl">
        <!-- Background Pattern & Glow -->
        <div class="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div class="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl px-6 sm:px-12 py-12 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            ✨ {{ settingsStore.settings.tagline }}
          </div>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Belanja Nyaman, <br />
            <span class="text-emerald-400 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
              Kualitas Pilihan Terbaik
            </span>
          </h1>

          <p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            Temukan koleksi produk fashion, gadget modern, dan gaya hidup terkini dengan kemudahan bayar transfer bank atau COD di tempat.
          </p>

          <div class="flex items-center gap-3 pt-2 flex-wrap">
            <router-link
              to="/products"
              class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/30 transition transform active:scale-95 flex items-center gap-2"
            >
              Belanja Sekarang
              <ArrowRight :size="16" />
            </router-link>

            <a
              href="#flash-sale"
              class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs transition"
            >
              Lihat Flash Sale
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Propositions / Benefit Strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Truck :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Gratis Ongkir</h4>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Klaim kupon subsidi ongkir</p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">100% Asli</h4>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Produk original bergaransi</p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <RotateCcw :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Retur Mudah</h4>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Garansi uang kembali 7 hari</p>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Headphones :size="20" />
          </div>
          <div>
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Bantuan Ramah</h4>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">WhatsApp CS siap membantu</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Super Flash Sale Section (if active) -->
    <section v-if="flashSale && flashSale.isActive && flashSale.showOnHome" id="flash-sale" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border border-rose-200 dark:border-rose-900/30">
        <!-- Flash Sale Header with Countdown -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-xs">
              ⚡ Flash Sale
            </span>
            <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100">
              {{ flashSale.name }}
            </h2>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Berakhir dalam:</span>
            <FlashSaleCountdown :target-date="flashSale.endDate" />
          </div>
        </div>

        <!-- Flash Sale Items Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="item in flashSaleProducts"
            :key="item.productId"
            class="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
            @click="router.push(`/products/${item.productId}`)"
          >
            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-2.5">
              <img :src="item.productImage" :alt="item.productName" class="w-full h-full object-cover" />
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px]">
                -{{ item.discountPercent }}%
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                {{ item.productName }}
              </h3>
              <div class="flex items-baseline gap-1.5">
                <span class="font-bold text-sm text-rose-600 dark:text-rose-400">
                  Rp {{ item.flashPrice.toLocaleString('id-ID') }}
                </span>
                <span class="text-[10px] text-gray-400 line-through">
                  Rp {{ item.originalPrice.toLocaleString('id-ID') }}
                </span>
              </div>

              <!-- Quota Bar -->
              <div class="pt-1">
                <div class="w-full bg-rose-100 dark:bg-rose-950/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    class="bg-rose-500 h-full rounded-full"
                    :style="{ width: `${Math.min(100, (item.soldQuota / item.stockQuota) * 100)}%` }"
                  ></div>
                </div>
                <span class="text-[9px] text-gray-400 block text-right mt-0.5">
                  {{ item.soldQuota }} terjual
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Kategori Pilihan</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Jelajahi berbagai produk berdasarkan kebutuhanmu</p>
        </div>
        <router-link to="/products" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">
          Lihat Semua →
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          v-for="cat in categories"
          :key="cat.name"
          type="button"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-200 text-left group"
          @click="navigateCategory(cat.query)"
        >
          <div class="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
            {{ cat.icon }}
          </div>
          <h3 class="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
            {{ cat.name }}
          </h3>
          <span class="text-[11px] text-gray-400">Pilihan Terlengkap</span>
        </button>
      </div>
    </section>

    <!-- Popular / Bestseller Products Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Produk Terpopuler</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Favorit pembeli dengan ulasan bintang tertinggi</p>
        </div>
        <router-link to="/products" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">
          Lihat Semua Katalog →
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="prod in popularProducts"
          :key="prod.id"
          :product="prod"
        />
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Koleksi Terbaru</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Produk terkini yang baru saja mendarat di toko kami</p>
        </div>
        <router-link to="/products" class="text-xs font-bold text-emerald-600 hover:text-emerald-700">
          Semua Koleksi →
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="prod in newProducts"
          :key="prod.id"
          :product="prod"
        />
      </div>
    </section>

    <!-- Customer Reviews / Testimonials -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Apa Kata Pembeli?</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Ribuan pelanggan puas dengan kecepatan dan kualitas kami</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="rev in reviews.slice(0, 3)"
          :key="rev.id"
          class="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-xs space-y-3"
        >
          <div class="flex items-center justify-between">
            <RatingStars :rating="rev.rating" :show-value="false" />
            <span class="text-[11px] text-gray-400">Terverifikasi</span>
          </div>
          <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{{ rev.comment }}"
          </p>
          <div class="flex items-center gap-3 pt-2">
            <img
              :src="rev.customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.customerName)}&background=10b981&color=fff`"
              :alt="rev.customerName"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p class="font-bold text-xs text-gray-900 dark:text-gray-100">{{ rev.customerName }}</p>
              <p class="text-[10px] text-gray-400">Membeli: {{ rev.productName }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
