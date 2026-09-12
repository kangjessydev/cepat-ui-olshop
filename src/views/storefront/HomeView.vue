<template>
  <div class="space-y-12 pb-16">
    <!-- Hero Banner Section -->
    <section class="relative bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <Sparkles :size="14" /> Cepat UI Olshop v0.1.0 Alpha
        </div>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          Starter Kit Toko Online <br class="hidden sm:block" />
          <span class="text-emerald-400 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Cepat, Fleksibel, Siap Pakai</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Dibangun khusus untuk ekosistem Vue 3 & Tailwind CSS dengan arsitektur adapter pattern, manajemen order, keranjang persisten, dan portal dashboard admin lengkap.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <router-link
            to="/admin"
            class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
          >
            Buka Dashboard Admin →
          </router-link>
          <a
            href="#features"
            class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm backdrop-blur transition"
          >
            Jelajahi Fitur
          </a>
        </div>
      </div>
    </section>

    <!-- Key Architecture Badges / Highlights -->
    <section id="features" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers :size="20" />
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white">Adapter Pattern</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Pemisahan modul auth, ongkir, storage gambar, dan notifikasi yang siap di-swap dari mock dev ke production backend (Laravel/Cloudinary/RajaOngkir).
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <CheckCircle :size="20" />
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white">TypeScript & Zod Validasi</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Form checkout, produk, dan diskon divalidasi ketat menggunakan VeeValidate + Zod schema dengan penanganan error interaktif.
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShoppingBag :size="20" />
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white">Full Flow E-Commerce</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mencakup katalog produk, filter dinamis, varian warna/ukuran, keranjang persisten, stepper checkout 3 langkah, hingga cetak invoice & resi pengiriman.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Layers, ShoppingBag, Sparkles } from '@lucide/vue'
</script>
