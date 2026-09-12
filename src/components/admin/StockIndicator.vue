<template>
  <div class="inline-flex items-center gap-1.5">
    <span :class="['w-2 h-2 rounded-full', indicatorDotClass]" />
    <span :class="['text-xs font-semibold', textClass]">
      {{ stockText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stock: number
}

const props = defineProps<Props>()

const indicatorDotClass = computed(() => {
  if (props.stock === 0) return 'bg-slate-400'
  if (props.stock <= 5) return 'bg-rose-500 animate-pulse'
  if (props.stock <= 10) return 'bg-amber-500'
  return 'bg-emerald-500'
})

const textClass = computed(() => {
  if (props.stock === 0) return 'text-slate-400'
  if (props.stock <= 5) return 'text-rose-600 dark:text-rose-400'
  if (props.stock <= 10) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-700 dark:text-slate-300'
})

const stockText = computed(() => {
  if (props.stock === 0) return 'Habis'
  if (props.stock <= 5) return `Sisa ${props.stock} (Kritis)`
  return `${props.stock} pcs`
})
</script>
