<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="relative inline-flex items-center justify-center">
        <span class="text-8xl font-black text-amber-500/20 select-none">403</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
            <ShieldAlert :size="36" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Akses Ditolak</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Anda tidak memiliki izin atau hak akses untuk melihat halaman ini. Silakan login menggunakan akun yang sesuai.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <router-link
          to="/"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition text-center"
        >
          Ke Toko Publik
        </router-link>
        <router-link
          to="/login"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition text-center"
        >
          Login Ulang
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert } from '@lucide/vue'
</script>
