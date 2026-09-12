<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { customersSeed } from '@/mock/customers.seed'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { ShoppingBag } from '@lucide/vue'

const router = useRouter()
const authStore = useCustomerAuthStore()

useSeo({
  title: 'Masuk Akun Pelanggan',
  description: 'Masuk ke akun Cepat Olshop untuk melacak pesanan dan mengelola alamat Anda.'
})

const email = ref('jessica.aurelia@gmail.com')
const password = ref('password123')

function handleLogin() {
  if (!email.value.trim()) {
    toast.error('Email wajib diisi')
    return
  }

  // Load from seed / localStorage
  const saved = localStorage.getItem('cepat_customers')
  let customers = saved ? JSON.parse(saved) : customersSeed
  const found = customers.find((c: any) => c.email.toLowerCase() === email.value.trim().toLowerCase())

  if (found) {
    authStore.login(found)
  } else {
    // Generate customer
    authStore.login({
      id: `cust_${Date.now()}`,
      name: email.value.split('@')[0],
      email: email.value,
      phone: '081234567890',
      totalOrders: 1,
      totalSpent: 250000,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  toast.success('Berhasil masuk ke akun!')
  router.push('/account')
}

function loginAsDemo(demoUser: any) {
  authStore.login(demoUser)
  toast.success(`Masuk sebagai ${demoUser.name}`)
  router.push('/account')
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-16 space-y-6">
    <div class="text-center space-y-2">
      <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
        <ShoppingBag :size="24" />
      </div>
      <h1 class="text-2xl font-black text-gray-900 dark:text-gray-100">Masuk ke Akun</h1>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Kelola riwayat pesanan, voucher hemat, dan alamat tersimpan
      </p>
    </div>

    <!-- Login Form -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
      <form class="space-y-4 text-xs" @submit.prevent="handleLogin">
        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email Pelanggan</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kata Sandi</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 text-xs"
        >
          Masuk Sekarang
        </button>
      </form>

      <!-- Quick Demo Login Presets -->
      <div class="pt-4 border-t border-gray-100 dark:border-gray-700/60 space-y-2">
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">Akun Demo Cepat:</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="p-2 bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 text-[11px] font-semibold text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 transition truncate"
            @click="loginAsDemo(customersSeed[0])"
          >
            Jessica (Gold)
          </button>
          <button
            type="button"
            class="p-2 bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 text-[11px] font-semibold text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 transition truncate"
            @click="loginAsDemo(customersSeed[1])"
          >
            Budi (Silver)
          </button>
        </div>
      </div>

      <div class="text-center pt-2 text-xs text-gray-500">
        Belum punya akun?
        <router-link to="/register" class="font-bold text-emerald-600 hover:underline ml-1">
          Daftar Gratis
        </router-link>
      </div>
    </div>
  </div>
</template>
