<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  images: string[]
  productName: string
}>()

const activeIndex = ref(0)
const isZoomModalOpen = ref(false)

const currentImage = computed(() => {
  return props.images?.[activeIndex.value] || props.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
})
</script>

<template>
  <div class="space-y-3">
    <!-- Main Large Image Container -->
    <div
      class="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 group cursor-zoom-in"
      @click="isZoomModalOpen = true"
    >
      <img
        :src="currentImage"
        :alt="productName"
        loading="lazy"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
        Perbesar
      </div>
    </div>

    <!-- Thumbnails Strip -->
    <div v-if="images && images.length > 1" class="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        :class="[
          'relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-100 dark:bg-gray-800',
          activeIndex === idx
            ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-105'
            : 'border-transparent opacity-70 hover:opacity-100'
        ]"
        @click="activeIndex = idx"
      >
        <img :src="img" :alt="`${productName} - thumbnail ${idx + 1}`" loading="lazy" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Zoom Modal -->
    <div
      v-if="isZoomModalOpen"
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      @click="isZoomModalOpen = false"
    >
      <div class="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
        <img :src="currentImage" :alt="productName" loading="lazy" class="max-h-[85vh] w-auto object-contain mx-auto rounded-xl" />
        <button
          type="button"
          class="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          @click.stop="isZoomModalOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
