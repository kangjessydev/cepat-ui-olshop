import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreSettings } from '@/types'

const SETTINGS_STORAGE_KEY = 'cepat_olshop_settings'

const defaultSettings: StoreSettings = {
  name: 'Cepat Olshop',
  tagline: 'Toko Online Cepat, Mudah, dan Terpercaya',
  description: 'Temukan berbagai produk pilihan berkualitas dengan harga terbaik dan pengiriman cepat ke seluruh Indonesia.',
  originCity: 'Jakarta Barat',
  originProvince: 'DKI Jakarta',
  primaryColor: '#10b981',
  paymentMethods: [
    {
      id: 'pay-bca',
      type: 'bank_transfer',
      name: 'Transfer Bank BCA',
      description: 'Transfer ke rekening BCA resmi',
      isEnabled: true,
      bankAccounts: [
        {
          id: 'bca-1',
          bankName: 'BCA',
          accountNumber: '8830123456',
          accountName: 'PT CEPAT OLSHOP INDONESIA',
          instructions: [
            'Pilih menu Transfer > Antar Rekening BCA',
            'Masukkan nomor rekening 8830123456',
            'Pastikan nama penerima adalah PT CEPAT OLSHOP INDONESIA',
            'Simpan bukti transfer dan unggah pada halaman konfirmasi pesanan'
          ]
        }
      ]
    },
    {
      id: 'pay-mandiri',
      type: 'bank_transfer',
      name: 'Transfer Bank Mandiri',
      description: 'Transfer ke rekening Mandiri resmi',
      isEnabled: true,
      bankAccounts: [
        {
          id: 'mandiri-1',
          bankName: 'Mandiri',
          accountNumber: '1680009876543',
          accountName: 'PT CEPAT OLSHOP INDONESIA'
        }
      ]
    },
    {
      id: 'pay-cod',
      type: 'cod',
      name: 'Bayar di Tempat (COD)',
      description: 'Bayar tunai langsung saat kurir mengantarkan paket pesanan Anda',
      isEnabled: true
    }
  ],
  shippingCouriers: [
    {
      id: 'jne-reg',
      code: 'reg',
      courierName: 'JNE',
      name: 'JNE Regular',
      cost: 12000,
      estimatedDays: '2 - 3 Hari'
    },
    {
      id: 'jnt-ez',
      code: 'ez',
      courierName: 'J&T',
      name: 'J&T EZ',
      cost: 14000,
      estimatedDays: '1 - 2 Hari'
    },
    {
      id: 'sicepat-best',
      code: 'best',
      courierName: 'SiCepat',
      name: 'SiCepat BEST',
      cost: 19000,
      estimatedDays: '1 Hari'
    }
  ],
  content: {
    banners: [
      {
        id: 'banner-1',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
        title: 'Koleksi Tren Fashion Pilihan',
        subtitle: 'Dapatkan diskon spesial hingga 40% untuk produk musim ini',
        ctaText: 'Belanja Sekarang',
        ctaLink: '/products',
        isActive: true
      }
    ],
    aboutUsText: 'Cepat Olshop adalah destinasi belanja online terpercaya yang menyediakan berbagai produk fashion, elektronik, dan kebutuhan harian dengan jaminan kualitas terbaik.',
    contactWhatsapp: '+6281234567890',
    contactEmail: 'halo@cepatolshop.id',
    contactAddress: 'Gedung Cepat Creative Hub Lt. 3, Jl. Kemang Raya No. 45, Jakarta Selatan',
    socialLinks: {
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com'
    }
  }
}

export const useStoreSettingsStore = defineStore('storeSettings', () => {
  const settings = ref<StoreSettings>(loadSettings())

  function loadSettings(): StoreSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch {
      return defaultSettings
    }
  }

  function updateSettings(newSettings: Partial<StoreSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings.value))
  }

  function resetToDefault() {
    settings.value = defaultSettings
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings))
  }

  return {
    settings,
    updateSettings,
    resetToDefault
  }
})
