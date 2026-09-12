<template>
  <div
    :class="[
      'animate-pulse bg-slate-200 dark:bg-slate-700/60',
      roundedClass,
      customClass
    ]"
    :style="customStyle"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  circle?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'md',
  circle: false,
  class: ''
})

const roundedClass = computed(() => {
  if (props.circle) return 'rounded-full'
  switch (props.rounded) {
    case 'none': return 'rounded-none'
    case 'sm': return 'rounded-sm'
    case 'md': return 'rounded-md'
    case 'lg': return 'rounded-lg'
    case 'xl': return 'rounded-xl'
    case 'full': return 'rounded-full'
    default: return 'rounded-md'
  }
})

const customStyle = computed(() => ({
  width: props.circle ? (props.height || props.width) : props.width,
  height: props.height,
}))

const customClass = computed(() => props.class)
</script>
