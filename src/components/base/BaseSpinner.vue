<template>
  <svg
    :class="[
      'animate-spin',
      sizeClass,
      colorClass,
      customClass
    ]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'current' | 'primary' | 'white' | 'slate'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'current',
  class: ''
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-3 h-3'
    case 'sm': return 'w-4 h-4'
    case 'md': return 'w-5 h-5'
    case 'lg': return 'w-6 h-6'
    case 'xl': return 'w-8 h-8'
    default: return 'w-5 h-5'
  }
})

const colorClass = computed(() => {
  switch (props.color) {
    case 'primary': return 'text-emerald-600 dark:text-emerald-400'
    case 'white': return 'text-white'
    case 'slate': return 'text-slate-400 dark:text-slate-500'
    case 'current':
    default: return 'text-current'
  }
})

const customClass = computed(() => props.class)
</script>
