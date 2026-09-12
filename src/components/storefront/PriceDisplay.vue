<script setup lang="ts">
import { computed } from 'vue'
import { formatRupiah } from '@/utils/formatCurrency'

const props = withDefaults(
  defineProps<{
    price: number
    originalPrice?: number
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md'
  }
)

const discountPercent = computed(() => {
  if (!props.originalPrice || props.originalPrice <= props.price) return 0
  const diff = props.originalPrice - props.price
  return Math.round((diff / props.originalPrice) * 100)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        price: 'text-xs sm:text-sm font-bold',
        original: 'text-[10px] sm:text-xs',
        badge: 'text-[9px] px-1 py-0.2'
      }
    case 'lg':
      return {
        price: 'text-xl sm:text-2xl font-black',
        original: 'text-xs sm:text-sm',
        badge: 'text-xs px-2 py-0.5'
      }
    case 'md':
    default:
      return {
        price: 'text-sm sm:text-base font-bold',
        original: 'text-[11px] sm:text-xs',
        badge: 'text-[10px] px-1.5 py-0.5'
      }
  }
})
</script>

<template>
  <div class="flex items-baseline gap-2 flex-wrap">
    <!-- Active Price -->
    <span :class="['text-emerald-600 dark:text-emerald-400 tracking-tight', sizeClasses.price]">
      {{ formatRupiah(price) }}
    </span>

    <!-- Strikethrough Original Price -->
    <span
      v-if="originalPrice && originalPrice > price"
      :class="['line-through text-gray-400 dark:text-gray-500', sizeClasses.original]"
    >
      {{ formatRupiah(originalPrice) }}
    </span>

    <!-- Discount Badge -->
    <span
      v-if="discountPercent > 0"
      :class="['font-bold rounded bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300', sizeClasses.badge]"
    >
      -{{ discountPercent }}%
    </span>
  </div>
</template>
