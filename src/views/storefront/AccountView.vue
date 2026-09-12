<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import type { Order, CustomerAddress } from '@/types'
import { ordersSeed } from '@/mock/orders.seed'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { User, Package, MapPin, LogOut } from '@lucide/vue'

const router = useRouter()
const authStore = useCustomerAuthStore()

useSeo({
  title: 'Akun Pelanggan Saya',
  description: 'Kelola profil, riwayat pesanan, dan alamat tersimpan Anda.'
})

const activeTab = ref<'orders' | 'addresses' | 'profile'>('orders')
const myOrders = ref<Order[]>([])

// Address modal
const isAddressModalOpen = ref(false)
const newAddress = ref<CustomerAddress>({
  recipientName: '',
  phone: '',
  addressLine: '',
  city: '',
  province: '',
  subdistrict: '',
  postalCode: '',
  notes: ''
})

onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.customer) {
    router.push('/login')
    return
  }
  loadCustomerOrders()
})

function loadCustomerOrders() {
  const saved = localStorage.getItem('cepat_orders')
  let allOrders: Order[] = []
  if (saved) {
    try {
      allOrders = JSON.parse(saved)
    } catch {
      allOrders = [...ordersSeed]
    }
  } else {
    allOrders = [...ordersSeed]
  }

  const custId = authStore.customer?.id
  const custEmail = authStore.customer?.email?.toLowerCase()

  myOrders.value = allOrders.filter(
    o => o.customerId === custId || o.customerEmail.toLowerCase() === custEmail
  )
}

function handleSaveAddress() {
  if (!newAddress.value.recipientName || !newAddress.value.phone || !newAddress.value.addressLine) {
    toast.error('Lengkapi nama, nomor telepon, dan alamat')
    return
  }

  authStore.addAddress({ ...newAddress.value })
  isAddressModalOpen.value = false
  newAddress.value = {
    recipientName: '',
    phone: '',
    addressLine: '',
    city: '',
    province: '',
    subdistrict: '',
    postalCode: '',
    notes: ''
  }
  toast.success('Alamat baru berhasil ditambahkan!')
}

function handleLogout() {
  authStore.logout()
  toast.info('Anda telah keluar dari akun')
  router.push('/')
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div v-if="authStore.customer" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <!-- Profile Banner Card -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <img
          :src="authStore.customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.customer.name)}&background=10b981&color=fff`"
          :alt="authStore.customer.name"
          class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
        />
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ authStore.customer.name }}</h1>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {{ authStore.customer.totalSpent > 2000000 ? 'Gold Member' : 'Silver Member' }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ authStore.customer.email }} • {{ authStore.customer.phone }}</p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        @click="handleLogout"
      >
        <LogOut :size="14" />
        Keluar Akun
      </button>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-6">
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors',
            activeTab === 'orders' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'orders'"
        >
          <Package :size="16" />
          Pesanan Saya ({{ myOrders.length }})
        </button>
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors',
            activeTab === 'addresses' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'addresses'"
        >
          <MapPin :size="16" />
          Alamat Tersimpan
        </button>
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors',
            activeTab === 'profile' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
          ]"
          @click="activeTab = 'profile'"
        >
          <User :size="16" />
          Data Profil
        </button>
      </nav>
    </div>

    <!-- TAB 1: Pesanan Saya -->
    <div v-if="activeTab === 'orders'" class="space-y-4">
      <div
        v-for="order in myOrders"
        :key="order.id"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs space-y-3"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700/60 text-xs">
          <div class="flex items-center gap-3">
            <span class="font-bold text-gray-900 dark:text-gray-100 font-mono">#{{ order.orderNumber }}</span>
            <span class="text-gray-400">• {{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <OrderStatusBadge :status="order.status" />
            <router-link
              :to="`/tracking?orderNumber=${order.orderNumber}`"
              class="font-bold text-emerald-600 hover:text-emerald-700 text-xs"
            >
              Lacak Pesanan →
            </router-link>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-3 text-xs"
          >
            <img :src="item.productImage" :alt="item.productName" class="w-12 h-12 rounded-xl object-cover" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ item.productName }}</p>
              <p class="text-gray-400 text-[11px]">x{{ item.quantity }} • {{ formatRupiah(item.price) }}</p>
            </div>
            <span class="font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(item.subtotal) }}</span>
          </div>
        </div>

        <div class="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center text-xs">
          <span class="text-gray-500">Total Pembayaran:</span>
          <span class="font-bold text-sm text-emerald-600 dark:text-emerald-400">{{ formatRupiah(order.totalAmount) }}</span>
        </div>
      </div>

      <div v-if="myOrders.length === 0" class="py-12 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        Anda belum memiliki riwayat pesanan.
      </div>
    </div>

    <!-- TAB 2: Alamat Tersimpan -->
    <div v-if="activeTab === 'addresses'" class="space-y-4">
      <div class="flex justify-end">
        <button
          type="button"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          @click="isAddressModalOpen = true"
        >
          + Tambah Alamat Baru
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(addr, idx) in authStore.customer.addresses"
          :key="idx"
          class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2 text-xs"
        >
          <div class="flex justify-between items-center">
            <span class="font-bold text-gray-900 dark:text-gray-100">{{ addr.recipientName }}</span>
            <button
              type="button"
              class="text-rose-500 hover:text-rose-600 text-xs"
              @click="authStore.removeAddress(idx)"
            >
              Hapus
            </button>
          </div>
          <p class="text-gray-500">{{ addr.phone }}</p>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ addr.addressLine }}, {{ addr.subdistrict }}, {{ addr.city }}, {{ addr.province }} {{ addr.postalCode }}
          </p>
        </div>
      </div>

      <div v-if="!authStore.customer.addresses?.length" class="py-12 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        Belum ada alamat tersimpan. Klik "+ Tambah Alamat Baru" untuk menambahkan alamat pengiriman Anda.
      </div>
    </div>

    <!-- TAB 3: Profil Saya -->
    <div v-if="activeTab === 'profile'" class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs max-w-xl space-y-4 text-xs">
      <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100">Informasi Pribadi</h3>
      <div>
        <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
        <input
          v-model="authStore.customer.name"
          type="text"
          class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
        />
      </div>
      <div>
        <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          v-model="authStore.customer.email"
          type="email"
          disabled
          class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
        />
      </div>
      <div>
        <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp / HP</label>
        <input
          v-model="authStore.customer.phone"
          type="tel"
          class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
        />
      </div>
      <div class="pt-2">
        <button
          type="button"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs"
          @click="toast.success('Profil berhasil diperbarui!')"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>

    <!-- Modal Tambah Alamat -->
    <div v-if="isAddressModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">Tambah Alamat Baru</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium mb-1">Nama Penerima</label>
            <input v-model="newAddress.recipientName" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
          </div>
          <div>
            <label class="block font-medium mb-1">No. HP / WhatsApp</label>
            <input v-model="newAddress.phone" type="tel" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
          </div>
          <div>
            <label class="block font-medium mb-1">Alamat Lengkap</label>
            <textarea v-model="newAddress.addressLine" rows="2" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-medium mb-1">Kota</label>
              <input v-model="newAddress.city" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
            </div>
            <div>
              <label class="block font-medium mb-1">Provinsi</label>
              <input v-model="newAddress.province" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button type="button" class="px-4 py-2 text-xs text-gray-500" @click="isAddressModalOpen = false">Batal</button>
          <button type="button" class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl" @click="handleSaveAddress">Simpan Alamat</button>
        </div>
      </div>
    </div>

  </div>
</template>
