<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Product, VariantMatrixItem } from '@/types'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'select', matrixItem: VariantMatrixItem | null, description: string): void
}>()

// Record of selected option per variant type, e.g. { "Warna": "Sage Green", "Ukuran": "M" }
const selectedOptions = ref<Record<string, string>>({})

onMounted(() => {
  initDefaults()
})

watch(() => props.product, () => {
  initDefaults()
})

function initDefaults() {
  if (!props.product.hasVariants || !props.product.variantTypes?.length) {
    emit('select', null, '')
    return
  }

  const initial: Record<string, string> = {}
  props.product.variantTypes.forEach(type => {
    if (type.options.length > 0) {
      initial[type.name] = type.options[0]
    }
  })
  selectedOptions.value = initial
  matchVariant()
}

function selectOption(typeName: string, optionValue: string) {
  selectedOptions.value = {
    ...selectedOptions.value,
    [typeName]: optionValue
  }
  matchVariant()
}

function matchVariant() {
  if (!props.product.variantMatrix || props.product.variantMatrix.length === 0) {
    const desc = Object.entries(selectedOptions.value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    emit('select', null, desc)
    return
  }

  // Find item in variantMatrix matching selected options
  const matched = props.product.variantMatrix.find(item => {
    return Object.entries(selectedOptions.value).every(
      ([key, val]) => item.combination[key] === val
    )
  })

  const desc = Object.entries(selectedOptions.value)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  emit('select', matched || null, desc)
}
</script>

<template>
  <div v-if="product.hasVariants && product.variantTypes?.length" class="space-y-4">
    <div
      v-for="variantType in product.variantTypes"
      :key="variantType.id || variantType.name"
      class="space-y-2"
    >
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-gray-900 dark:text-gray-100">
          Pilih {{ variantType.name }}:
        </span>
        <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
          {{ selectedOptions[variantType.name] || '-' }}
        </span>
      </div>

      <!-- Option Chips -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="opt in variantType.options"
          :key="opt"
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150',
            selectedOptions[variantType.name] === opt
              ? 'bg-emerald-50 border-emerald-600 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-emerald-300 shadow-xs scale-105'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 hover:bg-gray-50'
          ]"
          @click="selectOption(variantType.name, opt)"
        >
          {{ opt }}
        </button>
      </div>
    </div>
  </div>
</template>
