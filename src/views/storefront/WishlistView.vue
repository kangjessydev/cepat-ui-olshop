<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist.store'
import type { Product } from '@/types'
import { productRepository } from '@/repositories'
import ProductCard from '@/components/storefront/ProductCard.vue'
import EmptyState from '@/components/storefront/EmptyState.vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Wishlist Saya',
  description: 'Daftar produk favorit yang Anda simpan untuk dibeli nanti.'
})

const wishlistStore = useWishlistStore()
const allProducts = ref<Product[]>([])

onMounted(async () => {
  allProducts.value = await productRepository.getAll()
})

const wishlistedProducts = computed(() => {
  return allProducts.value.filter(p => wishlistStore.isWishlisted(p.id))
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div class="border-b border-gray-100 dark:border-gray-800 pb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Wishlist Favorit
        <span class="text-sm font-normal text-gray-400 ml-2">({{ wishlistedProducts.length }} produk)</span>
      </h1>
    </div>

    <!-- Product Grid -->
    <div v-if="wishlistedProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <ProductCard
        v-for="prod in wishlistedProducts"
        :key="prod.id"
        :product="prod"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-xs">
      <EmptyState
        title="Belum Ada Produk di Wishlist"
        description="Simpan produk yang kamu sukai dengan menekan ikon hati agar mudah ditemukan dan dibeli nanti."
        cta-text="Eksplorasi Produk"
        cta-link="/products"
      />
    </div>
  </div>
</template>
