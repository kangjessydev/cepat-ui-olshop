<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import PriceDisplay from './PriceDisplay.vue'
import RatingStars from './RatingStars.vue'
import WishlistButton from './WishlistButton.vue'
import { useCartStore } from '@/stores/cart.store'
import { toast } from 'vue-sonner'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()

const primaryImage = computed(() => {
  return props.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
})

function navigateToDetail() {
  router.push(`/products/${props.product.id}`)
}

function handleQuickAddToCart(e: Event) {
  e.preventDefault()
  e.stopPropagation()

  // If product has variants, direct user to detail page to pick options
  if (props.product.hasVariants) {
    router.push(`/products/${props.product.id}`)
    return
  }

  cartStore.addItem({
    productId: props.product.id,
    productName: props.product.name,
    productImage: primaryImage.value,
    price: props.product.price,
    quantity: 1
  })

  toast.success(`"${props.product.name}" dimasukkan ke keranjang!`)
}
</script>

<template>
  <div
    class="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col cursor-pointer"
    @click="navigateToDetail"
  >
    <!-- Image & Badges Container -->
    <div class="relative w-full aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Main Product Image with hover swap -->
      <img
        :src="primaryImage"
        :alt="product.name"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />

      <!-- Wishlist Floating Button -->
      <div class="absolute top-2.5 right-2.5 z-10">
        <WishlistButton :product-id="product.id" size="sm" />
      </div>

      <!-- Left Corner Badges -->
      <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        <!-- Out of stock badge -->
        <span
          v-if="product.stock <= 0"
          class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-900/80 text-white backdrop-blur-xs shadow-xs"
        >
          Habis
        </span>
        <!-- Low stock badge -->
        <span
          v-else-if="product.stock <= 5"
          class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs"
        >
          Sisa {{ product.stock }}
        </span>
      </div>

      <!-- Quick Add to Cart Overlay Button on Desktop Hover -->
      <div class="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:block">
        <button
          type="button"
          :disabled="product.stock <= 0"
          class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleQuickAddToCart"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {{ product.hasVariants ? 'Pilih Varian' : '+ Keranjang' }}
        </button>
      </div>
    </div>

    <!-- Details Container -->
    <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
      <div>
        <!-- Category tag -->
        <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
          {{ product.category?.name || 'Katalog' }}
        </span>

        <!-- Product Title -->
        <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
          {{ product.name }}
        </h3>
      </div>

      <!-- Pricing & Rating Footer -->
      <div class="space-y-1.5 pt-1">
        <PriceDisplay
          :price="product.price"
          :original-price="product.originalPrice"
          size="sm"
        />

        <div class="flex items-center justify-between text-xs pt-0.5">
          <RatingStars :rating="product.rating || 5" :total-reviews="product.reviewCount || 12" size="sm" />
          <span class="text-[11px] text-gray-400">
            {{ product.soldCount || 18 }} terjual
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
