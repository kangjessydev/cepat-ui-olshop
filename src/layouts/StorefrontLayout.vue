<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased">
    <!-- Storefront Header / Navbar -->
    <header class="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Brand Logo -->
        <router-link to="/" class="flex items-center gap-2.5 shrink-0 group">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
            <ShoppingBag :size="20" />
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-base tracking-tight leading-none text-slate-900 dark:text-white">Cepat Olshop</span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight">Official Store</span>
          </div>
        </router-link>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-6">
          <div class="relative w-full">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" :size="17" />
            <input
              type="text"
              placeholder="Cari produk impianmu..."
              class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-full text-xs sm:text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-950 transition"
            />
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Wishlist -->
          <router-link
            to="/account/wishlist"
            class="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Wishlist"
          >
            <Heart :size="20" />
          </router-link>

          <!-- Cart with Badge -->
          <router-link
            to="/cart"
            class="relative p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Keranjang Belanja"
          >
            <ShoppingCart :size="20" />
            <span
              v-if="cartCount > 0"
              class="absolute 0 top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </router-link>

          <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

          <!-- User Account / Login -->
          <router-link
            to="/account"
            class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
          >
            <User :size="18" />
            <span class="hidden sm:inline">Akun Saya</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Storefront Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Storefront Footer -->
    <footer class="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 pt-12 pb-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag :size="16" />
              </div>
              <span class="font-bold text-slate-900 dark:text-white">Cepat Olshop</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform starter kit toko online modern, cepat, dan siap pakai berbasis Vue 3 & Tailwind CSS.
            </p>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Belanja</h4>
            <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><router-link to="/products" class="hover:text-emerald-600 transition">Semua Produk</router-link></li>
              <li><router-link to="/#flash-sale" class="hover:text-emerald-600 transition">Flash Sale</router-link></li>
              <li><router-link to="/#kategori" class="hover:text-emerald-600 transition">Kategori Unggulan</router-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Bantuan & Akun</h4>
            <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><router-link to="/account/orders" class="hover:text-emerald-600 transition">Lacak Pesanan</router-link></li>
              <li><router-link to="/account" class="hover:text-emerald-600 transition">Profil & Alamat</router-link></li>
              <li><router-link to="/admin" class="hover:text-emerald-600 transition">Portal Admin Toko</router-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Metode Pembayaran</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mendukung Transfer Bank Otomatis/Manual (BCA, Mandiri, BNI, BRI) & Bayar di Tempat (COD).
            </p>
          </div>
        </div>

        <div class="border-t border-slate-200/60 dark:border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Cepat UI Olshop. Open source starter kit by Kang Jessy.</p>
          <div class="flex items-center gap-4">
            <router-link to="/privacy" class="hover:text-slate-600 dark:hover:text-slate-300">Privasi</router-link>
            <router-link to="/terms" class="hover:text-slate-600 dark:hover:text-slate-300">Syarat & Ketentuan</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Heart, Search, ShoppingBag, ShoppingCart, User } from '@lucide/vue'

// Temporary reactive cart count until pinia store is mounted
const cartCount = ref(0)
</script>
