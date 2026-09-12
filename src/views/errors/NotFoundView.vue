<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="relative inline-flex items-center justify-center">
        <span class="text-8xl font-black text-emerald-500/20 dark:text-emerald-400/20 select-none">404</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Search :size="36" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Halaman Tidak Ditemukan</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Maaf, halaman atau produk yang Anda tuju tidak tersedia, telah dipindahkan, atau alamat URL salah.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="router.back()"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition cursor-pointer"
        >
          Kembali Sebelumnya
        </button>
        <router-link
          to="/"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition text-center"
        >
          Menuju Beranda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
