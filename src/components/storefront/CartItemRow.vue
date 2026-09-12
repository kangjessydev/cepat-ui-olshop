<script setup lang="ts">
import type { OrderItem } from '@/types'
import { formatRupiah } from '@/utils/formatCurrency'

const props = defineProps<{
  item: OrderItem
}>()

const emit = defineEmits<{
  (e: 'update-qty', id: string, qty: number): void
  (e: 'remove', id: string): void
}>()

function decrement() {
  if (props.item.quantity > 1) {
    emit('update-qty', props.item.id, props.item.quantity - 1)
  } else {
    emit('remove', props.item.id)
  }
}

function increment() {
  emit('update-qty', props.item.id, props.item.quantity + 1)
}
</script>

<template>
  <div class="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <!-- Thumbnail -->
    <img
      :src="item.productImage"
      :alt="item.productName"
      loading="lazy"
      class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-shrink-0"
    />

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <router-link
        :to="`/products/${item.productId}`"
        class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-600 transition-colors line-clamp-1"
      >
        {{ item.productName }}
      </router-link>
      <p v-if="item.variantDescription" class="text-xs text-gray-400 mt-0.5">
        {{ item.variantDescription }}
      </p>
      <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
        {{ formatRupiah(item.price) }}
      </p>
    </div>

    <!-- Quantity Selector -->
    <div class="flex items-center gap-2">
      <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          class="px-2.5 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="decrement"
        >
          -
        </button>
        <span class="px-2 text-xs font-semibold text-gray-900 dark:text-gray-100 min-w-[24px] text-center">
          {{ item.quantity }}
        </span>
        <button
          type="button"
          class="px-2.5 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          @click="increment"
        >
          +
        </button>
      </div>

      <!-- Delete Button -->
      <button
        type="button"
        title="Hapus dari keranjang"
        class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
        @click="emit('remove', item.id)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
