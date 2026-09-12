<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useStoreSettingsStore } from '@/stores/settings.store'
import type { Order, CustomerAddress } from '@/types'
import { orderRepository, productRepository } from '@/repositories'
import CheckoutStepper from '@/components/storefront/CheckoutStepper.vue'
import { formatRupiah } from '@/utils/formatCurrency'
import { useSeo } from '@/composables/useSeo'
import { toast } from 'vue-sonner'
import { ShieldCheck, Truck, Check } from '@lucide/vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useCustomerAuthStore()
const settingsStore = useStoreSettingsStore()

useSeo({
  title: 'Checkout — Pengiriman & Pembayaran',
  description: 'Selesaikan transaksi belanja Anda dengan aman dan cepat di Cepat Olshop.'
})

onMounted(() => {
  if (cartStore.items.length === 0) {
    toast.error('Keranjang belanja kosong')
    router.push('/cart')
    return
  }

  // Pre-fill if logged in customer has default address
  if (authStore.customer) {
    const cust = authStore.customer
    shippingAddress.value.recipientName = cust.name
    shippingAddress.value.phone = cust.phone
    if (cust.addresses?.length) {
      const defaultAddr = cust.addresses[cust.defaultAddressIndex ?? 0]
      shippingAddress.value.addressLine = defaultAddr.addressLine
      shippingAddress.value.city = defaultAddr.city
      shippingAddress.value.province = defaultAddr.province
      shippingAddress.value.subdistrict = defaultAddr.subdistrict
      shippingAddress.value.postalCode = defaultAddr.postalCode
    }
  }
})

// Form State
const shippingAddress = ref<CustomerAddress>({
  recipientName: '',
  phone: '',
  addressLine: '',
  province: 'Jawa Barat',
  city: 'Kota Bandung',
  subdistrict: 'Coblong',
  postalCode: '40135',
  notes: ''
})

const customerEmail = ref(authStore.customer?.email || 'pembeli@cepatolshop.id')

// Selected Courier
const selectedCourierId = ref<string>('jne-reg')
const selectedPaymentMethod = ref<'bank_transfer' | 'cod'>('bank_transfer')
const selectedBank = ref<'BCA' | 'Mandiri'>('BCA')

const isSubmitting = ref(false)

// Couriers from settings
const couriers = computed(() => settingsStore.settings.shippingCouriers)

const activeCourier = computed(() => {
  return couriers.value.find(c => c.id === selectedCourierId.value) || couriers.value[0]
})

const shippingCost = computed(() => {
  return activeCourier.value?.cost || 12000
})

const finalTotalAmount = computed(() => {
  return cartStore.grandTotal + shippingCost.value
})

async function handlePlaceOrder() {
  // Validation
  if (!shippingAddress.value.recipientName.trim()) {
    toast.error('Nama penerima wajib diisi')
    return
  }
  if (!shippingAddress.value.phone.trim()) {
    toast.error('Nomor telepon/WhatsApp wajib diisi')
    return
  }
  if (!shippingAddress.value.addressLine.trim()) {
    toast.error('Alamat lengkap pengiriman wajib diisi')
    return
  }

  isSubmitting.value = true

  const orderId = `ord-${Date.now()}`
  const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`
  const now = new Date().toISOString()

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerId: authStore.customer?.id || `guest-${Date.now()}`,
    customerName: shippingAddress.value.recipientName,
    customerEmail: customerEmail.value,
    customerPhone: shippingAddress.value.phone,
    items: [...cartStore.items],
    subtotal: cartStore.subtotal,
    shippingCost: shippingCost.value,
    discountAmount: cartStore.discountAmount,
    totalAmount: finalTotalAmount.value,
    status: selectedPaymentMethod.value === 'cod' ? 'processing' : 'pending_payment',
    shipping: {
      courierName: activeCourier.value?.courierName || 'JNE',
      serviceName: activeCourier.value?.name || 'JNE Regular',
      cost: shippingCost.value,
      estimatedDelivery: activeCourier.value?.estimatedDays || '2-3 Hari',
      address: { ...shippingAddress.value }
    },
    payment: {
      method: selectedPaymentMethod.value,
      bankName: selectedPaymentMethod.value === 'bank_transfer' ? selectedBank.value : undefined,
      accountNumber: selectedBank.value === 'BCA' ? '8830123456' : '1680009876543',
      accountName: 'PT CEPAT OLSHOP INDONESIA',
      status: selectedPaymentMethod.value === 'cod' ? 'unpaid' : 'unpaid'
    },
    timeline: [
      {
        id: `tl-${Date.now()}`,
        title: 'Pesanan Berhasil Dibuat',
        description: selectedPaymentMethod.value === 'cod'
          ? 'Pesanan menggunakan metode Bayar di Tempat (COD) dan siap diproses'
          : 'Menunggu konfirmasi pembayaran dari pembeli',
        timestamp: now,
        status: selectedPaymentMethod.value === 'cod' ? 'processing' : 'pending_payment',
        actor: 'customer'
      }
    ],
    customerNotes: shippingAddress.value.notes,
    createdAt: now,
    updatedAt: now
  }

  // Create order via Repository
  await orderRepository.create(newOrder)

  // Deduct stock via Repository
  await productRepository.deductStock(
    cartStore.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  )

  // Clear Cart
  cartStore.clearCart()

  setTimeout(() => {
    isSubmitting.value = false
    toast.success('Pesanan berhasil dibuat!')
    router.push(`/orders/${newOrder.id}/success`)
  }, 600)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    
    <!-- Stepper -->
    <CheckoutStepper :current-step="2" />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Form Details (Address, Courier, Payment) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- 1. Alamat Pengiriman Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">
              Alamat Pengiriman
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap Penerima *</label>
              <input
                v-model="shippingAddress.recipientName"
                type="text"
                placeholder="Contoh: Jessica Aurelia"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp / HP *</label>
              <input
                v-model="shippingAddress.phone"
                type="tel"
                placeholder="Contoh: 081234567890"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap (Jalan, No Rumah, RT/RW) *</label>
              <textarea
                v-model="shippingAddress.addressLine"
                rows="2"
                placeholder="Contoh: Jl. Surya Kencana No. 42, RT 03 / RW 05"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kota / Kabupaten</label>
              <input
                v-model="shippingAddress.city"
                type="text"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Provinsi</label>
              <input
                v-model="shippingAddress.province"
                type="text"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kecamatan</label>
              <input
                v-model="shippingAddress.subdistrict"
                type="text"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Kode Pos</label>
              <input
                v-model="shippingAddress.postalCode"
                type="text"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-bold text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan untuk Kurir (Opsional)</label>
              <input
                v-model="shippingAddress.notes"
                type="text"
                placeholder="Contoh: Pagar hitam, titip satpam perumahan jika tidak ada orang"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <!-- 2. Pilihan Jasa Kirim Ekspedisi -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">
              Opsi Ekspedisi Pengiriman
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              v-for="c in couriers"
              :key="c.id"
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2',
                selectedCourierId === c.id
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:border-gray-300'
              ]"
              @click="selectedCourierId = c.id"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-gray-900 dark:text-gray-100 uppercase">{{ c.name }}</span>
                <div v-if="selectedCourierId === c.id" class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check :size="10" />
                </div>
              </div>
              <p class="text-[11px] text-gray-400">Estimasi: {{ c.estimatedDays }}</p>
              <p class="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {{ formatRupiah(c.cost) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 3. Metode Pembayaran -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">
              Metode Pembayaran
            </h2>
          </div>

          <div class="space-y-3">
            <!-- Bank Transfer Option -->
            <div
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all space-y-3',
                selectedPaymentMethod === 'bank_transfer'
                  ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              ]"
              @click="selectedPaymentMethod = 'bank_transfer'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-xs text-gray-900 dark:text-gray-100">Transfer Bank Otomatis / Manual</span>
                  <p class="text-[11px] text-gray-400">Transfer ke rekening resmi toko dan unggah bukti transfer</p>
                </div>
                <div v-if="selectedPaymentMethod === 'bank_transfer'" class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check :size="10" />
                </div>
              </div>

              <!-- Bank Selection -->
              <div v-if="selectedPaymentMethod === 'bank_transfer'" class="flex items-center gap-3 pt-2">
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input v-model="selectedBank" type="radio" value="BCA" class="text-emerald-600" />
                  <span>Bank BCA</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input v-model="selectedBank" type="radio" value="Mandiri" class="text-emerald-600" />
                  <span>Bank Mandiri</span>
                </label>
              </div>
            </div>

            <!-- COD Option -->
            <div
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all',
                selectedPaymentMethod === 'cod'
                  ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              ]"
              @click="selectedPaymentMethod = 'cod'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-xs text-gray-900 dark:text-gray-100">Bayar di Tempat (COD)</span>
                  <p class="text-[11px] text-gray-400">Bayar tunai ke kurir saat paket pesanan tiba di rumah Anda</p>
                </div>
                <div v-if="selectedPaymentMethod === 'cod'" class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check :size="10" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Order Summary & Confirm -->
      <div class="lg:col-span-4 space-y-4">
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs space-y-4">
          <h3 class="font-bold text-sm text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-700">
            Rincian Pesanan
          </h3>

          <!-- Items preview -->
          <div class="max-h-56 overflow-y-auto space-y-3 divide-y divide-gray-100 dark:divide-gray-700/60 pr-1">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-3 pt-2 first:pt-0"
            >
              <img :src="item.productImage" :alt="item.productName" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ item.productName }}</p>
                <p class="text-gray-400 text-[10px]">x{{ item.quantity }} • {{ formatRupiah(item.price) }}</p>
              </div>
              <span class="text-xs font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(item.subtotal) }}</span>
            </div>
          </div>

          <!-- Financial Breakdown -->
          <div class="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex justify-between">
              <span>Subtotal Produk:</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(cartStore.subtotal) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Ongkos Kirim ({{ activeCourier?.courierName }}):</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(shippingCost) }}</span>
            </div>

            <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-emerald-600 font-medium">
              <span>Diskon Voucher ({{ cartStore.appliedVoucher?.code }}):</span>
              <span>-{{ formatRupiah(cartStore.discountAmount) }}</span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-sm text-gray-900 dark:text-gray-100">
              <span>Total Tagihan:</span>
              <span class="text-emerald-600 dark:text-emerald-400 text-base">{{ formatRupiah(finalTotalAmount) }}</span>
            </div>
          </div>

          <!-- Confirm Order CTA Button -->
          <button
            type="button"
            :disabled="isSubmitting"
            class="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            @click="handlePlaceOrder"
          >
            <span v-if="isSubmitting">Memproses Pesanan...</span>
            <span v-else>Konfirmasi & Buat Pesanan Sekarang</span>
          </button>
        </div>

        <!-- Guarantees -->
        <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div class="flex items-center gap-2">
            <ShieldCheck :size="16" class="text-emerald-600" />
            <span>Pembayaran Aman & Bebas Penipuan</span>
          </div>
          <div class="flex items-center gap-2">
            <Truck :size="16" class="text-blue-600" />
            <span>Resi Pengiriman Otomatis Tersedia</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
