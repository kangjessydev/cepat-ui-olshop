<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="relative inline-flex items-center justify-center">
        <span class="text-8xl font-black text-rose-500/20 select-none">500</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/10">
            <ServerCrash :size="36" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Gangguan Server</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Terjadi kesalahan saat memproses permintaan Anda. Tim kami telah menerima laporan ini dan sedang mengatasinya.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="reload"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition cursor-pointer"
        >
          Muat Ulang Halaman
        </button>
        <router-link
          to="/"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition text-center"
        >
          Ke Beranda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServerCrash } from '@lucide/vue'

function reload() {
  window.location.reload()
}
</script>
