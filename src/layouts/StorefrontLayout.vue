<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Search, ShoppingBag, ShoppingCart, User, Menu, X } from '@lucide/vue'
import { useCartStore } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'
import { useStoreSettingsStore } from '@/stores/settings.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const settingsStore = useStoreSettingsStore()
const authStore = useCustomerAuthStore()

const searchInput = ref('')
const isMobileMenuOpen = ref(false)

const cartCount = computed(() => cartStore.totalItemsCount)
const wishlistCount = computed(() => wishlistStore.totalCount)
const storeSettings = computed(() => settingsStore.settings)

function handleSearch() {
  if (searchInput.value.trim()) {
    router.push({ path: '/products', query: { q: searchInput.value.trim() } })
    isMobileMenuOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-sans antialiased">
    <!-- Top Announcement Strip -->
    <div class="bg-emerald-600 text-white text-[11px] py-1.5 px-4 text-center font-medium">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <span class="hidden sm:inline">⚡ Super Flash Sale Sedang Berlangsung! Dapatkan Diskon Hingga 40%</span>
        <span class="sm:hidden mx-auto">⚡ Promo Diskon Spesial s/d 40%!</span>
        <div class="hidden sm:flex items-center gap-4 text-[10px]">
          <router-link to="/tracking" class="hover:underline opacity-90">Lacak Pesanan</router-link>
          <span>•</span>
          <router-link to="/admin" class="hover:underline opacity-90">Portal Admin</router-link>
        </div>
      </div>
    </div>

    <!-- Main Header Navbar -->
    <header class="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="p-2 -ml-2 text-gray-600 dark:text-gray-300 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Menu v-if="!isMobileMenuOpen" :size="20" />
          <X v-else :size="20" />
        </button>

        <!-- Brand Logo -->
        <router-link to="/" class="flex items-center gap-2.5 shrink-0 group">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
            <ShoppingBag :size="20" />
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-base tracking-tight leading-none text-gray-900 dark:text-white">
              {{ storeSettings.name }}
            </span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight mt-0.5">
              Official Store
            </span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-300 ml-4">
          <router-link to="/" class="hover:text-emerald-600 transition" active-class="text-emerald-600 font-bold">
            Beranda
          </router-link>
          <router-link to="/products" class="hover:text-emerald-600 transition" active-class="text-emerald-600 font-bold">
            Semua Produk
          </router-link>
          <router-link to="/products?category=Fashion+Pria" class="hover:text-emerald-600 transition">
            Fashion
          </router-link>
          <router-link to="/products?category=Gadget+%26+Audio" class="hover:text-emerald-600 transition">
            Gadget
          </router-link>
          <router-link to="/tracking" class="hover:text-emerald-600 transition">
            Cek Resi
          </router-link>
        </nav>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-md mx-4">
          <form class="relative w-full" @submit.prevent="handleSearch">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
            <input
              v-model="searchInput"
              type="text"
              placeholder="Cari kemeja, smartwatch, tumbler..."
              class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-emerald-500 rounded-full text-xs focus:outline-hidden focus:bg-white dark:focus:bg-gray-950 transition"
            />
          </form>
        </div>

        <!-- Navigation Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Wishlist -->
          <router-link
            to="/wishlist"
            class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            title="Wishlist Favorit"
          >
            <Heart :size="20" />
            <span
              v-if="wishlistCount > 0"
              class="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ wishlistCount }}
            </span>
          </router-link>

          <!-- Cart with Badge -->
          <router-link
            to="/cart"
            class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            title="Keranjang Belanja"
          >
            <ShoppingCart :size="20" />
            <span
              v-if="cartCount > 0"
              class="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-scale-in"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </router-link>

          <div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

          <!-- Customer Account / Login -->
          <router-link
            :to="authStore.isAuthenticated ? '/account' : '/login'"
            class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            <User :size="18" />
            <span class="hidden sm:inline">
              {{ authStore.isAuthenticated ? (authStore.customer?.name?.split(' ')[0] || 'Akun') : 'Masuk' }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Mobile Search (Sub-navbar) -->
      <div class="md:hidden px-4 pb-3">
        <form class="relative w-full" @submit.prevent="handleSearch">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" :size="15" />
          <input
            v-model="searchInput"
            type="text"
            placeholder="Cari produk impianmu..."
            class="w-full pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-emerald-500 rounded-full text-xs focus:outline-hidden"
          />
        </form>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-2 text-sm font-medium">
        <router-link to="/" class="block py-2 text-gray-700 dark:text-gray-300" @click="isMobileMenuOpen = false">
          Beranda
        </router-link>
        <router-link to="/products" class="block py-2 text-gray-700 dark:text-gray-300" @click="isMobileMenuOpen = false">
          Semua Produk
        </router-link>
        <router-link to="/tracking" class="block py-2 text-gray-700 dark:text-gray-300" @click="isMobileMenuOpen = false">
          Lacak Pesanan (Cek Resi)
        </router-link>
        <router-link to="/cart" class="block py-2 text-gray-700 dark:text-gray-300" @click="isMobileMenuOpen = false">
          Keranjang ({{ cartCount }})
        </router-link>
        <router-link to="/wishlist" class="block py-2 text-gray-700 dark:text-gray-300" @click="isMobileMenuOpen = false">
          Wishlist ({{ wishlistCount }})
        </router-link>
        <div class="pt-2 border-t border-gray-100 dark:border-gray-800">
          <router-link
            :to="authStore.isAuthenticated ? '/account' : '/login'"
            class="block py-2 font-bold text-emerald-600"
            @click="isMobileMenuOpen = false"
          >
            {{ authStore.isAuthenticated ? 'Profil Saya' : 'Masuk / Daftar Akun' }}
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Storefront Slot -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Storefront Footer -->
    <footer class="border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 pt-12 pb-8 mt-16 text-xs text-gray-600 dark:text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span class="font-bold text-sm text-gray-900 dark:text-white">{{ storeSettings.name }}</span>
            </div>
            <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {{ storeSettings.description }}
            </p>
            <p class="text-xs text-gray-500">
              Pengiriman dari: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ storeSettings.originCity }}</span>
            </p>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Belanja</h4>
            <ul class="space-y-2">
              <li><router-link to="/products" class="hover:text-emerald-600 transition">Semua Produk</router-link></li>
              <li><router-link to="/products?category=Fashion+Pria" class="hover:text-emerald-600 transition">Koleksi Fashion</router-link></li>
              <li><router-link to="/products?category=Gadget+%26+Audio" class="hover:text-emerald-600 transition">Gadget & Audio</router-link></li>
              <li><router-link to="/#flash-sale" class="hover:text-emerald-600 transition">Super Flash Sale</router-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Layanan Pelanggan</h4>
            <ul class="space-y-2">
              <li><router-link to="/tracking" class="hover:text-emerald-600 transition font-semibold text-emerald-600 dark:text-emerald-400">Lacak Status Pesanan</router-link></li>
              <li><router-link to="/account" class="hover:text-emerald-600 transition">Profil & Alamat Kirim</router-link></li>
              <li><a :href="`https://wa.me/${storeSettings.content.contactWhatsapp.replace(/\D/g, '')}`" target="_blank" class="hover:text-emerald-600 transition">WhatsApp CS ({{ storeSettings.content.contactWhatsapp }})</a></li>
              <li><router-link to="/admin" class="hover:text-emerald-600 transition">Portal Masuk Admin</router-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Metode Bayar & Ekspedisi</h4>
            <p class="leading-relaxed text-gray-500 dark:text-gray-400 mb-3">
              Mendukung Transfer Bank Otomatis/Manual (BCA, Mandiri) dan Bayar di Tempat (COD).
            </p>
            <div class="flex items-center gap-2 flex-wrap text-[10px] font-bold text-gray-600 dark:text-gray-400">
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">BCA</span>
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">MANDIRI</span>
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">COD</span>
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">JNE</span>
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">SICEPAT</span>
              <span class="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">J&T</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <p>© 2026 {{ storeSettings.name }}. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <span>Garansi 100% Produk Original</span>
            <span>•</span>
            <span>Pengiriman Cepat & Aman</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
