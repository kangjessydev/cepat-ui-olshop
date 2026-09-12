<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product, VariantMatrixItem, ProductReview } from '@/types'
import { productRepository, reviewRepository } from '@/repositories'
import { useCartStore } from '@/stores/cart.store'
import { useStoreSettingsStore } from '@/stores/settings.store'
import ProductGallery from '@/components/storefront/ProductGallery.vue'
import PriceDisplay from '@/components/storefront/PriceDisplay.vue'
import RatingStars from '@/components/storefront/RatingStars.vue'
import VariantSelector from '@/components/storefront/VariantSelector.vue'
import WishlistButton from '@/components/storefront/WishlistButton.vue'
import ProductCard from '@/components/storefront/ProductCard.vue'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { Truck, ShieldCheck, ShoppingCart, Zap } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const settingsStore = useStoreSettingsStore()

const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const productReviews = ref<ProductReview[]>([])

const quantity = ref(1)
const selectedVariant = ref<VariantMatrixItem | null>(null)
const selectedVariantDesc = ref('')
const activeTab = ref<'desc' | 'specs' | 'reviews'>('desc')

useSeo(() => ({
  title: product.value ? product.value.name : 'Detail Produk',
  description: product.value ? product.value.description.slice(0, 150) : '',
  image: product.value?.images?.[0]
}))

onMounted(async () => {
  await loadProduct()
})

watch(() => route.params.id, async () => {
  await loadProduct()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

async function loadProduct() {
  const id = route.params.id as string
  const prods = await productRepository.getAll()

  const found = prods.find(p => p.id === id || p.slug === id)
  if (!found) {
    toast.error('Produk tidak ditemukan')
    router.push('/products')
    return
  }

  product.value = found
  quantity.value = 1
  selectedVariant.value = null
  selectedVariantDesc.value = ''

  // Related products
  relatedProducts.value = prods
    .filter(p => p.id !== found.id && p.category?.id === found.category?.id)
    .slice(0, 4)

  // Reviews
  const allRevs = await reviewRepository.getAll()
  productReviews.value = allRevs.filter(r => r.productId === found.id && r.status === 'approved')
  // If no specific reviews for this product, show general reviews
  if (productReviews.value.length === 0) {
    productReviews.value = allRevs.filter(r => r.status === 'approved').slice(0, 2)
  }
}

// Active price considering variant
const currentPrice = computed(() => {
  if (selectedVariant.value && selectedVariant.value.price) {
    return selectedVariant.value.price
  }
  return product.value?.price || 0
})

// Active stock considering variant
const currentStock = computed(() => {
  if (selectedVariant.value && selectedVariant.value.stock !== undefined) {
    return selectedVariant.value.stock
  }
  return product.value?.stock || 0
})

function handleVariantSelect(variant: VariantMatrixItem | null, desc: string) {
  selectedVariant.value = variant
  selectedVariantDesc.value = desc
  if (quantity.value > currentStock.value) {
    quantity.value = Math.max(1, currentStock.value)
  }
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--
}

function incrementQty() {
  if (quantity.value < currentStock.value) {
    quantity.value++
  } else {
    toast.info('Jumlah melebihi stok yang tersedia')
  }
}

function handleAddToCart() {
  if (!product.value) return
  if (currentStock.value <= 0) {
    toast.error('Maaf, stok produk sedang habis')
    return
  }

  cartStore.addItem({
    productId: product.value.id,
    productName: product.value.name,
    productImage: product.value.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    price: currentPrice.value,
    quantity: quantity.value,
    variantDescription: selectedVariantDesc.value || undefined
  })

  toast.success(`Berhasil menambahkan ${quantity.value}x "${product.value.name}" ke keranjang!`)
}

function handleBuyNow() {
  handleAddToCart()
  router.push('/checkout')
}
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-400">
      <router-link to="/" class="hover:text-emerald-600 transition">Beranda</router-link>
      <span>/</span>
      <router-link to="/products" class="hover:text-emerald-600 transition">Katalog</router-link>
      <span>/</span>
      <span class="text-gray-700 dark:text-gray-300 font-medium truncate max-w-xs">{{ product.name }}</span>
    </nav>

    <!-- Main Detail Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      
      <!-- Left Column: Product Gallery -->
      <div class="lg:col-span-6">
        <ProductGallery
          :images="product.images"
          :product-name="product.name"
        />
      </div>

      <!-- Right Column: Product Buy Box & Options -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {{ product.category?.name || 'Katalog' }}
          </span>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
            {{ product.name }}
          </h1>

          <!-- Ratings & Sold Count -->
          <div class="flex items-center gap-4 mt-2.5 text-xs">
            <RatingStars :rating="product.rating || 5" :total-reviews="product.reviewCount || 12" />
            <span class="text-gray-300">|</span>
            <span class="text-gray-500">{{ product.soldCount || 18 }} Terjual</span>
            <span class="text-gray-300">|</span>
            <span :class="currentStock > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'">
              {{ currentStock > 0 ? `Stok Tersedia (${currentStock})` : 'Stok Habis' }}
            </span>
          </div>
        </div>

        <!-- Pricing Card -->
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-1">
          <PriceDisplay
            :price="currentPrice"
            :original-price="product.originalPrice"
            size="lg"
          />
          <p class="text-[11px] text-gray-400">
            Harga sudah termasuk PPN. Dapatkan kupon voucher hemat saat checkout.
          </p>
        </div>

        <!-- Variant Selector -->
        <div v-if="product.hasVariants">
          <VariantSelector
            :product="product"
            @select="handleVariantSelect"
          />
        </div>

        <!-- Quantity Selector & Total Price preview -->
        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-gray-900 dark:text-gray-100">Jumlah Pembelian</label>
          <div class="flex items-center gap-3">
            <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xs">
              <button
                type="button"
                :disabled="quantity <= 1"
                class="px-3.5 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="decrementQty"
              >
                -
              </button>
              <span class="px-3 text-xs font-bold text-gray-900 dark:text-gray-100 min-w-[32px] text-center">
                {{ quantity }}
              </span>
              <button
                type="button"
                :disabled="quantity >= currentStock"
                class="px-3.5 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="incrementQty"
              >
                +
              </button>
            </div>
            <span class="text-xs text-gray-400">Tersedia {{ currentStock }} unit</span>
          </div>
        </div>

        <!-- Action Buttons: Add to Cart & Buy Now & Wishlist -->
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            :disabled="currentStock <= 0"
            class="flex-1 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleAddToCart"
          >
            <ShoppingCart :size="16" />
            + Keranjang
          </button>

          <button
            type="button"
            :disabled="currentStock <= 0"
            class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleBuyNow"
          >
            <Zap :size="16" />
            Beli Sekarang
          </button>

          <div class="shrink-0">
            <WishlistButton :product-id="product.id" size="md" />
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="border-t border-gray-100 dark:border-gray-800 pt-5 grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2.5">
            <Truck :size="18" class="text-emerald-600 shrink-0" />
            <span>Pengiriman Cepat dari {{ settingsStore.settings.originCity }}</span>
          </div>
          <div class="flex items-center gap-2.5">
            <ShieldCheck :size="18" class="text-blue-600 shrink-0" />
            <span>Jaminan 100% Produk Original</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Product Details Tabs -->
    <div class="border-t border-gray-200 dark:border-gray-800 pt-8">
      <div class="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-2">
        <button
          type="button"
          :class="[
            'pb-2 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'desc'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'desc'"
        >
          Deskripsi Lengkap
        </button>
        <button
          type="button"
          :class="[
            'pb-2 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'specs'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'specs'"
        >
          Spesifikasi & Pengiriman
        </button>
        <button
          type="button"
          :class="[
            'pb-2 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'reviews'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'reviews'"
        >
          Ulasan Pembeli ({{ productReviews.length }})
        </button>
      </div>

      <!-- Tab Content: Deskripsi -->
      <div v-if="activeTab === 'desc'" class="pt-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 max-w-4xl">
        <p class="whitespace-pre-line">{{ product.description }}</p>
      </div>

      <!-- Tab Content: Spesifikasi -->
      <div v-if="activeTab === 'specs'" class="pt-6 max-w-xl">
        <div class="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
          <div class="py-2.5 flex justify-between">
            <span class="text-gray-400">Kategori:</span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ product.category?.name || '-' }}</span>
          </div>
          <div class="py-2.5 flex justify-between">
            <span class="text-gray-400">SKU Produk:</span>
            <span class="font-mono text-gray-900 dark:text-gray-100">{{ product.sku || '-' }}</span>
          </div>
          <div class="py-2.5 flex justify-between">
            <span class="text-gray-400">Berat Paket:</span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ product.weight || 500 }} gram</span>
          </div>
          <div class="py-2.5 flex justify-between">
            <span class="text-gray-400">Dikirim Dari:</span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ settingsStore.settings.originCity }}, {{ settingsStore.settings.originProvince }}</span>
          </div>
          <div class="py-2.5 flex justify-between">
            <span class="text-gray-400">Opsi Ekspedisi:</span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">JNE, SiCepat, J&T</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Ulasan Pembeli -->
      <div v-if="activeTab === 'reviews'" class="pt-6 space-y-4 max-w-3xl">
        <div
          v-for="r in productReviews"
          :key="r.id"
          class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-2"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img
                :src="r.customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=10b981&color=fff`"
                :alt="r.customerName"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p class="font-bold text-xs text-gray-900 dark:text-gray-100">{{ r.customerName }}</p>
                <RatingStars :rating="r.rating" :show-value="false" size="sm" />
              </div>
            </div>
            <span class="text-[10px] text-gray-400">Pembeli Terverifikasi</span>
          </div>
          <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{{ r.comment }}"
          </p>
          <div v-if="r.reply" class="ml-4 p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg text-xs border-l-2 border-emerald-500 space-y-0.5">
            <span class="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">Tanggapan Toko:</span>
            <p class="text-gray-600 dark:text-gray-400 text-[11px]">{{ r.reply.comment }}</p>
          </div>
        </div>

        <div v-if="productReviews.length === 0" class="py-8 text-center text-xs text-gray-400">
          Belum ada ulasan untuk produk ini. Jadilah pembeli pertama yang memberikan ulasan!
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <div v-if="relatedProducts.length > 0" class="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-6">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
        Produk Serupa yang Mungkin Kamu Sukai
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="rel in relatedProducts"
          :key="rel.id"
          :product="rel"
        />
      </div>
    </div>

  </div>
</template>
