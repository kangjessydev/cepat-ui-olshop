<template>
  <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
        <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Peringatan Stok Kritis</h3>
      </div>
      <span class="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold">
        {{ products.length }} Produk
      </span>
    </div>

    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
      Produk berikut memiliki sisa stok kurang dari 5 pcs dan disarankan untuk restock segera:
    </p>

    <div class="space-y-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/40 dark:bg-rose-950/10 flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            :src="product.images[0]"
            :alt="product.name"
            loading="lazy"
            class="w-10 h-10 rounded-lg object-cover border border-rose-200/60 dark:border-rose-900/40 shrink-0"
          />
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {{ product.name }}
            </p>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">SKU: {{ product.sku }}</span>
          </div>
        </div>

        <div class="text-right shrink-0">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
            Sisa {{ product.stock }}
          </span>
        </div>
      </div>
    </div>

    <router-link
      to="/admin/products"
      class="w-full mt-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
    >
      Kelola Stok di Daftar Produk →
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

defineProps<Props>()
</script>
