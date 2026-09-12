<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { ShoppingBag } from '@lucide/vue'

const router = useRouter()
const authStore = useCustomerAuthStore()

useSeo({
  title: 'Daftar Akun Pelanggan Baru',
  description: 'Daftar akun baru di Cepat Olshop untuk pengalaman belanja terbaik.'
})

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

function handleRegister() {
  if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
    toast.error('Mohon lengkapi seluruh formulir pendaftaran')
    return
  }

  authStore.register({
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim()
  })

  toast.success('Pendaftaran akun berhasil! Selamat datang di Cepat Olshop')
  router.push('/account')
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-16 space-y-6">
    <div class="text-center space-y-2">
      <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
        <ShoppingBag :size="24" />
      </div>
      <h1 class="text-2xl font-black text-gray-900 dark:text-gray-100">Buat Akun Baru</h1>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Daftar sekarang untuk mendapatkan voucher belanja pengguna baru
      </p>
    </div>

    <!-- Register Form -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
      <form class="space-y-4 text-xs" @submit.prevent="handleRegister">
        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap *</label>
          <input
            v-model="name"
            type="text"
            placeholder="Contoh: Rian Hidayat"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email *</label>
          <input
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp / HP *</label>
          <input
            v-model="phone"
            type="tel"
            placeholder="081234567890"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kata Sandi *</label>
          <input
            v-model="password"
            type="password"
            placeholder="Minimal 6 karakter"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 text-xs"
        >
          Daftar Sekarang
        </button>
      </form>

      <div class="text-center pt-2 text-xs text-gray-500">
        Sudah memiliki akun?
        <router-link to="/login" class="font-bold text-emerald-600 hover:underline ml-1">
          Masuk di Sini
        </router-link>
      </div>
    </div>
  </div>
</template>
