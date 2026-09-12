<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rating: number
    totalReviews?: number
    size?: 'sm' | 'md'
    showValue?: boolean
  }>(),
  {
    size: 'sm',
    showValue: true
  }
)

const formattedRating = computed(() => {
  return Number(props.rating).toFixed(1)
})
</script>

<template>
  <div class="inline-flex items-center gap-1.5 text-amber-400">
    <!-- Star Icons -->
    <div class="flex items-center">
      <span
        v-for="star in 5"
        :key="star"
        :class="[
          'leading-none',
          size === 'sm' ? 'text-xs' : 'text-sm',
          star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
        ]"
      >
        ★
      </span>
    </div>

    <!-- Rating Value & Total Reviews -->
    <div v-if="showValue" class="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
      <span class="text-gray-800 dark:text-gray-200 font-semibold">{{ formattedRating }}</span>
      <span v-if="totalReviews !== undefined" class="text-gray-400">({{ totalReviews }})</span>
    </div>
  </div>
</template>
