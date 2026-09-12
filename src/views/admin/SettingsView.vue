<script setup lang="ts">
import { ref } from 'vue'
import { useStoreSettingsStore } from '@/stores/settings.store'
import { toast } from 'vue-sonner'

const settingsStore = useStoreSettingsStore()
const activeTab = ref<'profile' | 'payment' | 'shipping' | 'content'>('profile')

// Clone current settings to local form
const form = ref(JSON.parse(JSON.stringify(settingsStore.settings)))

function handleSave() {
  settingsStore.updateSettings(form.value)
  toast.success('Pengaturan toko berhasil disimpan!')
}

function handleReset() {
  if (confirm('Kembalikan pengaturan ke pengaturan awal toko?')) {
    settingsStore.resetToDefault()
    form.value = JSON.parse(JSON.stringify(settingsStore.settings))
    toast.info('Pengaturan toko telah direset ke default')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Toko</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Konfigurasi identitas toko, nomor rekening pembayaran, kurir pengiriman, dan informasi kontak
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          @click="handleReset"
        >
          Reset Default
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          @click="handleSave"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Simpan Perubahan
        </button>
      </div>
    </div>

    <!-- Nav Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-6">
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'profile'"
        >
          Profil Toko
        </button>
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'payment'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'payment'"
        >
          Metode Pembayaran
        </button>
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'shipping'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'shipping'"
        >
          Ekspedisi & Kurir
        </button>
        <button
          type="button"
          :class="[
            'py-3 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'content'
              ? 'border-emerald-600 text-emerald-600 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
          @click="activeTab = 'content'"
        >
          Kontak & Medsos
        </button>
      </nav>
    </div>

    <!-- TAB 1: Profil Toko -->
    <div v-if="activeTab === 'profile'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Informasi Dasar Toko</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Toko Online</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100 font-semibold"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Slogan / Tagline Toko</label>
          <input
            v-model="form.tagline"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat Toko</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Kota Asal Pengiriman Toko</label>
          <input
            v-model="form.originCity"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Provinsi Asal</label>
          <input
            v-model="form.originProvince"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>

    <!-- TAB 2: Metode Pembayaran -->
    <div v-if="activeTab === 'payment'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Daftar Kanal Pembayaran</h2>
      <p class="text-xs text-gray-400">Pilih metode bayar yang dapat digunakan oleh pembeli saat checkout.</p>

      <div class="space-y-4">
        <div
          v-for="pm in form.paymentMethods"
          :key="pm.id"
          class="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ pm.name }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                {{ pm.type }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ pm.description }}</p>
            
            <!-- Bank account list if bank transfer -->
            <div v-if="pm.bankAccounts?.length" class="mt-2 text-xs text-gray-700 dark:text-gray-300">
              <span class="font-medium text-emerald-600">Rekening:</span> {{ pm.bankAccounts[0].bankName }} {{ pm.bankAccounts[0].accountNumber }} a.n {{ pm.bankAccounts[0].accountName }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 font-medium">{{ pm.isEnabled ? 'Aktif' : 'Non-Aktif' }}</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                pm.isEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
              ]"
              @click="pm.isEnabled = !pm.isEnabled"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                  pm.isEnabled ? 'translate-x-4' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Ekspedisi & Kurir -->
    <div v-if="activeTab === 'shipping'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Ekspedisi & Tarif Ongkos Kirim Standar</h2>
      <p class="text-xs text-gray-400">Atur kurir rekanan dan biaya ongkir estimasi flat per kilogram.</p>

      <div class="space-y-4">
        <div
          v-for="c in form.shippingCouriers"
          :key="c.id"
          class="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ c.name }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold uppercase">
                {{ c.courierName }}
              </span>
            </div>
            <p class="text-gray-500 mt-1">Estimasi Tiba: {{ c.estimatedDays }}</p>
          </div>

          <div class="flex items-center gap-4">
            <div>
              <label class="block font-medium text-gray-500 mb-1">Tarif Flat (Rp)</label>
              <input
                v-model.number="c.cost"
                type="number"
                min="0"
                step="1000"
                class="w-32 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: Kontak & Medsos -->
    <div v-if="activeTab === 'content'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-6">
      <h2 class="font-bold text-sm text-gray-900 dark:text-gray-100">Kontak Customer Service & Media Sosial</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor WhatsApp CS</label>
          <input
            v-model="form.content.contactWhatsapp"
            type="text"
            placeholder="+6281234567890"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Email Resmi</label>
          <input
            v-model="form.content.contactEmail"
            type="email"
            placeholder="halo@cepatolshop.id"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Kantor / Toko Fisik</label>
          <input
            v-model="form.content.contactAddress"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
          <input
            v-model="form.content.socialLinks.instagram"
            type="text"
            placeholder="https://instagram.com/cepatolshop"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="block font-medium text-gray-700 dark:text-gray-300 mb-1">TikTok URL</label>
          <input
            v-model="form.content.socialLinks.tiktok"
            type="text"
            placeholder="https://tiktok.com/@cepatolshop"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>
