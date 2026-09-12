<script setup lang="ts">
defineProps<{
  currentStep: number // 1, 2, or 3
}>()

const steps = [
  { step: 1, title: 'Pengiriman' },
  { step: 2, title: 'Pembayaran' },
  { step: 3, title: 'Selesai' }
]
</script>

<template>
  <div class="flex items-center justify-center max-w-lg mx-auto py-4">
    <div v-for="(s, idx) in steps" :key="s.step" class="flex items-center">
      <!-- Step Node -->
      <div class="flex items-center gap-2">
        <div
          :class="[
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
            currentStep > s.step
              ? 'bg-emerald-600 text-white shadow-xs'
              : currentStep === s.step
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-xs'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          ]"
        >
          <svg v-if="currentStep > s.step" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ s.step }}</span>
        </div>
        <span
          :class="[
            'text-xs font-semibold',
            currentStep >= s.step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
          ]"
        >
          {{ s.title }}
        </span>
      </div>

      <!-- Connector Line -->
      <div
        v-if="idx < steps.length - 1"
        :class="[
          'w-12 sm:w-20 h-0.5 mx-3 transition-colors',
          currentStep > s.step ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'
        ]"
      ></div>
    </div>
  </div>
</template>
