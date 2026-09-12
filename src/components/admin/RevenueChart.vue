<template>
  <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
      <div>
        <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Tren Penjualan 7 Hari Terakhir</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Total pendapatan harian minggu ini</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <TrendingUp :size="14" /> +18.4% vs minggu lalu
        </span>
      </div>
    </div>

    <!-- Chart Bars Visualization -->
    <div class="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1">
      <div
        v-for="(item, idx) in weeklyData"
        :key="idx"
        class="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
      >
        <!-- Tooltip on hover -->
        <div
          class="opacity-0 group-hover:opacity-100 transition pointer-events-none absolute -top-8 px-2 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-md z-10"
        >
          {{ formatRupiah(item.revenue) }}
        </div>

        <!-- Bar Pillar -->
        <div class="w-full max-w-[40px] bg-slate-100 dark:bg-slate-800/80 rounded-t-lg relative overflow-hidden h-full flex items-end">
          <div
            class="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90"
            :class="item.isToday ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-emerald-600/60 dark:bg-emerald-500/50'"
            :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }"
          />
        </div>

        <!-- Day Label -->
        <span
          :class="[
            'text-[10px] sm:text-xs font-medium',
            item.isToday ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'
          ]"
        >
          {{ item.day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp } from '@lucide/vue'
import { formatRupiah } from '@/utils/formatCurrency'

interface DayRevenue {
  day: string
  revenue: number
  isToday?: boolean
}

const weeklyData: DayRevenue[] = [
  { day: 'Sen', revenue: 1250000 },
  { day: 'Sel', revenue: 1680000 },
  { day: 'Rab', revenue: 1420000 },
  { day: 'Kam', revenue: 1950000 },
  { day: 'Jum', revenue: 2100000 },
  { day: 'Sab', revenue: 2850000 },
  { day: 'Min', revenue: 2450000, isToday: true },
]

const maxRevenue = computed(() => {
  return Math.max(...weeklyData.map(d => d.revenue)) * 1.15
})
</script>
