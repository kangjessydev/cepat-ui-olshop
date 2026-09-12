<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  targetDate: string
}>()

const timeLeft = ref(0)
let timer: number | null = null

function updateCountdown() {
  const target = new Date(props.targetDate).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)
  timeLeft.value = diff
}

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const hours = computed(() => {
  const h = Math.floor(timeLeft.value / (1000 * 60 * 60))
  return String(h).padStart(2, '0')
})

const minutes = computed(() => {
  const m = Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60))
  return String(m).padStart(2, '0')
})

const seconds = computed(() => {
  const s = Math.floor((timeLeft.value % (1000 * 60)) / 1000)
  return String(s).padStart(2, '0')
})
</script>

<template>
  <div class="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
    <!-- Hours -->
    <div class="bg-gray-900 dark:bg-black text-white px-2 py-1 rounded-md shadow-xs min-w-[28px] text-center">
      {{ hours }}
    </div>
    <span class="text-gray-400 font-bold">:</span>
    <!-- Minutes -->
    <div class="bg-gray-900 dark:bg-black text-white px-2 py-1 rounded-md shadow-xs min-w-[28px] text-center">
      {{ minutes }}
    </div>
    <span class="text-gray-400 font-bold">:</span>
    <!-- Seconds -->
    <div class="bg-rose-600 text-white px-2 py-1 rounded-md shadow-xs min-w-[28px] text-center animate-pulse">
      {{ seconds }}
    </div>
  </div>
</template>
