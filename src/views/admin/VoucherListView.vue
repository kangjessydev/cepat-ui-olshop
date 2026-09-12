<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Voucher, DiscountType } from '@/types'
import { vouchersSeed } from '@/mock/vouchers.seed'
import { formatRupiah } from '@/utils/formatCurrency'
import { toast } from 'vue-sonner'

const vouchers = ref<Voucher[]>([])
const isModalOpen = ref(false)
const editingVoucherId = ref<string | null>(null)

// Form fields
const form = ref({
  code: '',
  title: '',
  description: '',
  discountType: 'fixed' as DiscountType,
  discountValue: 10000,
  maxDiscount: 0,
  minOrderAmount: 50000,
  usageLimit: 100,
  startDate: '',
  endDate: '',
  isActive: true
})

onMounted(() => {
  loadVouchers()
})

function loadVouchers() {
  const saved = localStorage.getItem('cepat_vouchers')
  if (saved) {
    try {
      vouchers.value = JSON.parse(saved)
    } catch {
      vouchers.value = [...vouchersSeed]
    }
  } else {
    vouchers.value = [...vouchersSeed]
    localStorage.setItem('cepat_vouchers', JSON.stringify(vouchersSeed))
  }
}

function saveToStorage() {
  localStorage.setItem('cepat_vouchers', JSON.stringify(vouchers.value))
}

function openCreateModal() {
  editingVoucherId.value = null
  const today = new Date().toISOString().split('T')[0]
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  form.value = {
    code: '',
    title: '',
    description: '',
    discountType: 'fixed',
    discountValue: 15000,
    maxDiscount: 0,
    minOrderAmount: 100000,
    usageLimit: 100,
    startDate: today,
    endDate: nextMonth,
    isActive: true
  }
  isModalOpen.value = true
}

function openEditModal(voucher: Voucher) {
  editingVoucherId.value = voucher.id
  form.value = {
    code: voucher.code,
    title: voucher.title,
    description: voucher.description || '',
    discountType: voucher.discountType,
    discountValue: voucher.discountValue,
    maxDiscount: voucher.maxDiscount || 0,
    minOrderAmount: voucher.minOrderAmount,
    usageLimit: voucher.usageLimit || 100,
    startDate: voucher.startDate.split('T')[0],
    endDate: voucher.endDate.split('T')[0],
    isActive: voucher.isActive
  }
  isModalOpen.value = true
}

function handleSubmit() {
  if (!form.value.code.trim()) {
    toast.error('Kode voucher wajib diisi')
    return
  }

  if (editingVoucherId.value) {
    const idx = vouchers.value.findIndex(v => v.id === editingVoucherId.value)
    if (idx !== -1) {
      vouchers.value[idx] = {
        ...vouchers.value[idx],
        code: form.value.code.toUpperCase().trim(),
        title: form.value.title,
        description: form.value.description,
        discountType: form.value.discountType,
        discountValue: Number(form.value.discountValue),
        maxDiscount: form.value.discountType === 'percentage' && form.value.maxDiscount ? Number(form.value.maxDiscount) : undefined,
        minOrderAmount: Number(form.value.minOrderAmount),
        usageLimit: Number(form.value.usageLimit),
        startDate: new Date(form.value.startDate).toISOString(),
        endDate: new Date(form.value.endDate + 'T23:59:59Z').toISOString(),
        isActive: form.value.isActive
      }
      toast.success('Voucher berhasil diperbarui')
    }
  } else {
    const newVoucher: Voucher = {
      id: `vouch-${Date.now()}`,
      code: form.value.code.toUpperCase().trim(),
      title: form.value.title,
      description: form.value.description,
      discountType: form.value.discountType,
      discountValue: Number(form.value.discountValue),
      maxDiscount: form.value.discountType === 'percentage' && form.value.maxDiscount ? Number(form.value.maxDiscount) : undefined,
      minOrderAmount: Number(form.value.minOrderAmount),
      usageLimit: Number(form.value.usageLimit),
      usedCount: 0,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: new Date(form.value.endDate + 'T23:59:59Z').toISOString(),
      isActive: form.value.isActive
    }
    vouchers.value.unshift(newVoucher)
    toast.success('Voucher diskon baru berhasil dibuat!')
  }

  saveToStorage()
  isModalOpen.value = false
}

function toggleVoucherActive(voucher: Voucher) {
  voucher.isActive = !voucher.isActive
  saveToStorage()
  toast.success(`Voucher ${voucher.code} ${voucher.isActive ? 'diaktifkan' : 'dinonaktifkan'}`)
}

function deleteVoucher(voucher: Voucher) {
  if (confirm(`Yakin ingin menghapus voucher ${voucher.code}?`)) {
    vouchers.value = vouchers.value.filter(v => v.id !== voucher.id)
    saveToStorage()
    toast.success('Voucher telah dihapus')
  }
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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Voucher & Kupon Diskon</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Buat kode promo belanja, potongan nominal tetap, diskon persentase, atau gratis ongkir
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        @click="openCreateModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Voucher Baru
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <th class="py-3.5 px-6">Kode & Nama Voucher</th>
              <th class="py-3.5 px-4">Nilai Diskon</th>
              <th class="py-3.5 px-4">Min. Belanja</th>
              <th class="py-3.5 px-4">Penggunaan / Kuota</th>
              <th class="py-3.5 px-4">Periode Aktif</th>
              <th class="py-3.5 px-4 text-center">Status</th>
              <th class="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
            <tr v-for="v in vouchers" :key="v.id" class="hover:bg-gray-50/75 dark:hover:bg-gray-750/50 transition-colors">
              <!-- Code & Title -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-mono font-bold text-xs">
                    {{ v.code }}
                  </span>
                </div>
                <p class="font-bold text-gray-900 dark:text-gray-100 mt-1 text-sm">{{ v.title }}</p>
                <p v-if="v.description" class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ v.description }}</p>
              </td>

              <!-- Discount Value -->
              <td class="py-4 px-4 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">
                <span v-if="v.discountType === 'percentage'" class="text-emerald-600">
                  {{ v.discountValue }}%
                  <span v-if="v.maxDiscount" class="text-[11px] font-normal text-gray-400 block">
                    Maks. {{ formatRupiah(v.maxDiscount) }}
                  </span>
                </span>
                <span v-else class="text-emerald-600">
                  {{ formatRupiah(v.discountValue) }}
                </span>
              </td>

              <!-- Min Amount -->
              <td class="py-4 px-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                {{ formatRupiah(v.minOrderAmount) }}
              </td>

              <!-- Usage Quota -->
              <td class="py-4 px-4 whitespace-nowrap text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900 dark:text-gray-100">{{ v.usedCount }}</span>
                  <span class="text-gray-400">/ {{ v.usageLimit || '∞' }} terpakai</span>
                </div>
                <div v-if="v.usageLimit" class="w-24 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    class="bg-emerald-500 h-full rounded-full"
                    :style="{ width: `${Math.min(100, (v.usedCount / v.usageLimit) * 100)}%` }"
                  ></div>
                </div>
              </td>

              <!-- Period -->
              <td class="py-4 px-4 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(v.startDate) }} - {{ formatDate(v.endDate) }}
              </td>

              <!-- Toggle Status -->
              <td class="py-4 px-4 text-center whitespace-nowrap">
                <button
                  type="button"
                  :class="[
                    'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                    v.isActive ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                  ]"
                  @click="toggleVoucherActive(v)"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                      v.isActive ? 'translate-x-4' : 'translate-x-0'
                    ]"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                    title="Edit Voucher"
                    @click="openEditModal(v)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                    title="Hapus Voucher"
                    @click="deleteVoucher(v)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="vouchers.length === 0" class="py-12 text-center text-xs text-gray-400">
        Belum ada voucher dibuat. Klik tombol "+ Tambah Voucher Baru" untuk membuat kupon promo pertama Anda.
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-lg w-full p-6 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">
            {{ editingVoucherId ? 'Ubah Voucher Diskon' : 'Buat Voucher Diskon Baru' }}
          </h3>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="isModalOpen = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3.5 text-xs">
          <!-- Kode Kupon & Judul -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Voucher *</label>
              <input
                v-model="form.code"
                type="text"
                placeholder="CONTOH: HEMAT50"
                class="w-full px-3 py-2 uppercase font-mono font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Judul / Promo *</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Diskon Akhir Pekan"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="Contoh: Potongan Rp 20.000 untuk pengguna baru"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <!-- Tipe Diskon & Nilai -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe Diskon</label>
              <select
                v-model="form.discountType"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              >
                <option value="fixed">Nominal Tetap (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ form.discountType === 'percentage' ? 'Persentase Potongan (%)' : 'Besaran Diskon (Rp)' }} *
              </label>
              <input
                v-model.number="form.discountValue"
                type="number"
                min="1"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100 font-bold"
              />
            </div>
          </div>

          <!-- Maks Diskon (jika persen) & Min Belanja -->
          <div class="grid grid-cols-2 gap-3">
            <div v-if="form.discountType === 'percentage'">
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Maks. Potongan (Rp)</label>
              <input
                v-model.number="form.maxDiscount"
                type="number"
                min="0"
                placeholder="0 = Tanpa batas"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div :class="form.discountType === 'percentage' ? '' : 'col-span-2'">
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Belanja (Rp) *</label>
              <input
                v-model.number="form.minOrderAmount"
                type="number"
                min="0"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <!-- Kuota Pemakaian -->
          <div>
            <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Batas Kuota Pemakaian (0 = Unlimited)</label>
            <input
              v-model.number="form.usageLimit"
              type="number"
              min="0"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <!-- Tanggal Mulai & Berakhir -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Mulai Berlaku</label>
              <input
                v-model="form.startDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Berakhir Pada</label>
              <input
                v-model="form.endDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="isModalOpen = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            @click="handleSubmit"
          >
            Simpan Voucher
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
