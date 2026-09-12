<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }>(),
  {
    ctaText: 'Belanja Sekarang',
    ctaLink: '/products'
  }
)
</script>

<template>
  <div class="py-16 px-4 text-center max-w-md mx-auto space-y-4">
    <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>

    <div class="space-y-1">
      <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">{{ title }}</h3>
      <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {{ description }}
      </p>
    </div>

    <div v-if="ctaText" class="pt-2">
      <router-link
        :to="ctaLink"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition transform active:scale-95"
      >
        {{ ctaText }} →
      </router-link>
    </div>
  </div>
</template>
