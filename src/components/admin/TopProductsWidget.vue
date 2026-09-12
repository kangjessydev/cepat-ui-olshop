<template>
  <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Produk Terlaris</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Paling banyak dipesan bulan ini</p>
      </div>
      <Flame class="text-amber-500" :size="18" />
    </div>

    <div class="space-y-3.5">
      <div
        v-for="(product, idx) in products"
        :key="product.id"
        class="flex items-center gap-3 group"
      >
        <div class="relative shrink-0">
          <img
            :src="product.images[0]"
            :alt="product.name"
            loading="lazy"
            class="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
          />
          <span
            class="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-slate-700"
          >
            {{ idx + 1 }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition">
            {{ product.name }}
          </p>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {{ formatRupiah(product.price) }}
            </span>
            <span class="text-[10px] text-slate-400">• {{ product.soldCount }} terjual</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Flame } from '@lucide/vue'
import { formatRupiah } from '@/utils/formatCurrency'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

defineProps<Props>()
</script>
