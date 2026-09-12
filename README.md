# Cepat UI Olshop

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Cepat UI Olshop** adalah full-stack Vue 3 + Tailwind CSS v4 e-commerce starter kit yang dirancang khusus untuk pasar toko online Indonesia. Dilengkapi dengan **Storefront Publik** responsif, **Dashboard Admin Toko Online** lengkap, **Pluggable Adapter Pattern** (pengiriman, penyimpanan, notifikasi, autentikasi), serta **CLI Generator** yang mempercepat pengembangan aplikasi.

---

## 📑 Daftar Isi

- [Fitur Unggulan](#-fitur-unggulan)
  - [1. Storefront Publik](#1-storefront-publik)
  - [2. Dashboard Admin Toko Online](#2-dashboard-admin-toko-online)
  - [3. Pluggable Adapter Pattern](#3-pluggable-adapter-pattern)
  - [4. Ekosistem Addons](#4-ekosistem-addons)
- [Akun Demo Bawaan](#-akun-demo-bawaan)
- [Panduan Memulai Cepat](#-panduan-memulai-cepat)
- [Cepat UI CLI Tooling](#-cepat-ui-cli-tooling)
- [Konfigurasi Adapter](#-konfigurasi-adapter)
- [Struktur Direktori](#-struktur-direktori)
- [Build & Deployment](#-build--deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🌟 Fitur Unggulan

### 1. Storefront Publik
- **Beranda Interaktif (`/`)**: Hero banner dinamis, 4 strip keunggulan toko, Super Flash Sale dengan real-time countdown timer, kategori pilihan, produk bestseller & new arrivals, dan testimoni ulasan pelanggan.
- **Katalog Produk Dinamis (`/products`)**: Filter kategori, slider rentang harga, rating minimum bintang, sortir (Terbaru, Terlaris, Termurah, Termahal), pencarian real-time dengan URL query sync, dan tombol *Muat Lebih Banyak*.
- **Halaman Detail Produk (`/products/:id`)**: Galeri foto produk dengan thumbnail strip dan zoom modal, selektor varian dinamis (warna & ukuran) dengan matrix stok dan harga otomatis, kontrol kuantitas, tombol "+ Keranjang" & "Beli Sekarang", tab deskripsi, spesifikasi, dan ulasan berbalas toko.
- **Keranjang Belanja (`/cart`)**: Manajemen item per baris `[-] [n] [+]`, input kode voucher promo dengan validasi kuota diskon instan, ringkasan pembayaran, dan state keranjang kosong.
- **Alur Checkout Mandiri (`/checkout`)**: Stepper progres 3 langkah, formulir alamat tujuan, pemilihan ekspedisi kurir (JNE, SiCepat, J&T) dengan kalkulasi ongkir real-time, opsi pembayaran transfer bank (BCA/Mandiri) & COD, pengurangan stok otomatis, dan redirect ke halaman sukses.
- **Konfirmasi Pembayaran (`/orders/:id/success`)**: Animasi perayaan sukses, salin nomor pesanan, instruksi rekening pembayaran dengan tombol salin nomor rekening, form unggah struk bukti transfer, dan tombol pelacakan.
- **Pelacakan Pesanan Publik (`/tracking`)**: Cek resi dan status pesanan langsung tanpa harus login menggunakan nomor pesanan atau nomor telepon pelanggan.
- **Area Akun Pelanggan (`/account`)**: Profil pengguna, riwayat status pesanan, dan buku alamat tersimpan.
- **Wishlist Favorit (`/wishlist`)**: Simpan produk favorit pelanggan yang tersinkronisasi via Pinia store.
- **SEO & Meta Tags**: Composable `useSeo()` untuk title, deskripsi, dan Open Graph tags dinamis per halaman.

---

### 2. Dashboard Admin Toko Online
- **Ringkasan Toko (`/admin`)**: 4 KPI metrik utama (Total Omzet, Pesanan Masuk, Produk Aktif, Peringatan Stok Kritis), grafik tren pendapatan 7 hari, tabel 5 pesanan terbaru, produk terlaris, dan widget stok menipis.
- **Manajemen Produk (`/admin/products`)**: Data table produk dengan filter tab status (Semua, Aktif, Habis, Stok Kritis), multi-image upload dengan pratinjau, form varian builder dinamis, dan ekspor data ke CSV.
- **Manajemen Pesanan (`/admin/orders`)**: Filter pesanan berdasarkan status (Pending, Diproses, Dikirim, Selesai, Batal), detail pesanan lengkap dengan timeline status, input nomor resi pengiriman, konfirmasi bukti pembayaran, dan **Cetak Faktur Invoice & Label Pengiriman Paket** (`@media print` standar A4).
- **Data Pelanggan (`/admin/customers`)**: Daftar pelanggan dengan metrik total belanja, detail pelanggan, riwayat pesanan, dan tautan langsung hubungi via WhatsApp.
- **Voucher & Promo Diskon (`/admin/vouchers`)**: Kelola kode kupon promo, jenis diskon (potongan nominal flat atau persentase), batas minimum belanja, kuota pemakaian, dan periode berlaku.
- **Kampanye Flash Sale (`/admin/flash-sale`)**: Kelola produk flash sale berjangka waktu, alokasi stok kuota khusus, kalkulasi diskon otomatis, dan sakelar tayang di beranda.
- **Moderasi Ulasan (`/admin/reviews`)**: Persetujuan/penolakan ulasan dari pembeli, filter rating bintang, dan fitur balasan resmi toko (*store reply*).
- **Laporan Penjualan (`/admin/reports`)**: Analisis omzet penjualan, rasio per kategori, ekspor laporan performa ke CSV, dan format cetak ringkasan laporan.
- **Pengaturan Toko (`/admin/settings`)**: Profil toko, konfigurasi rekening bank tujuan transfer, tarif flat ongkir ekspedisi, dan kontak media sosial toko.

---

### 3. Pluggable Adapter Pattern
Arsitektur Cepat UI Olshop menerapkan Adapter Pattern murni, sehingga logika UI tidak terikat pada satu vendor tertentu:

| Kategori | Lokasi | Pilihan Adapter Bawaan | Perintah Switch CLI |
|---|---|---|---|
| **Payment (Pembayaran)** | `src/adapters/payment/` | `manual` (Transfer BCA/Mandiri + COD), `xendit` (Invoice, QRIS, VA) | `npx cepat use:adapter payment xendit` |
| **Shipping (Ekspedisi)** | `src/adapters/shipping/` | `manual` (Flat Rate), `rajaongkir` (RajaOngkir API) | `npx cepat use:adapter shipping rajaongkir` |
| **Storage (Unggah Berkas)** | `src/adapters/storage/` | `local` (Base64), `indexed-db` (IndexedDB Offline), `cloudinary` | `npx cepat use:adapter storage cloudinary` |
| **Notification (Real-Time)** | `src/adapters/notification/` | `polling` (Interval Poller), `websocket` (WebSocket Server) | `npx cepat use:adapter notification websocket` |
| **Auth (Autentikasi)** | `src/plugins/auth.ts` | `mock` (In-Memory/Storage), `sanctum` (Laravel Sanctum API) | `npx cepat use:backend sanctum` |

---

### 4. Ekosistem Addons
- **PWA Ready**: Dilengkapi konfigurasi Web App Manifest (`public/manifest.json`) dan service worker helper (`src/addons/pwa/registerServiceWorker.ts`).
- **E-Commerce Analytics**: Composable `useAnalytics()` di `src/composables/useAnalytics.ts` yang siap diintegrasikan dengan Google Analytics 4 (GA4) dan Plausible untuk melacak event `view_item`, `add_to_cart`, `begin_checkout`, dan `purchase`.
- **Template Email Notifikasi**: Template HTML modern dan responsif di `src/addons/email/` untuk konfirmasi pesanan (`order-confirmation.html`), update resi pengiriman (`shipping-update.html`), dan reset password (`reset-password.html`).
- **Client-Side PDF Export**: Utility cetak PDF bersih tanpa ketergantungan library berat (`src/utils/exportPdf.ts`).
- **i18n & Multi-Currency**: Kamus lokalisasi Bahasa Indonesia (`id.json`) & English (`en.json`) serta format mata uang cerdas di `src/addons/i18n/index.ts`.

---

## 🔑 Akun Demo Bawaan

Aplikasi dilengkapi dengan data seed realistis di `src/mock/` yang langsung aktif tanpa memerlukan konfigurasi database eksternal:

### Akun Administrator Toko:
- **Email**: `admin@cepat.dev`
- **Password**: `password123`
- **Akses**: Akses penuh ke seluruh menu Admin Dashboard (`/admin`).

### Akun Pelanggan Demo:
- **Akun 1**: `jessica@gmail.com` (Password: `password123`) — Memiliki riwayat 3 pesanan dan 2 alamat tersimpan.
- **Akun 2**: `budi@gmail.com` (Password: `password123`) — Pelanggan setia dengan 5 transaksi.

---

## 🚀 Panduan Memulai Cepat

### 1. Kloning Repository & Instal Dependensi

```bash
git clone https://github.com/kangjessydev/cepat-ui-olshop.git
cd cepat-ui-olshop
npm install
```

### 2. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban pada alamat `http://localhost:5173`.
- **Storefront Publik**: `http://localhost:5173/`
- **Dashboard Admin**: `http://localhost:5173/admin`

---

## 🛠 Cepat UI CLI Tooling

CLI generator bawaan memudahkan scaffolding fitur dan penyesuaian arsitektur secara instan:

```bash
# Menampilkan bantuan dan daftar perintah CLI
npx cepat --help

# 1. Scaffold resource admin baru (ListView, FormView, router, dan sidebar)
npx cepat make:admin-resource Supplier --icon=Truck

# 2. Scaffold halaman storefront baru (dengan integrasi SEO)
npx cepat make:storefront-page PromoRamadhan

# 3. Buat Pinia store baru dengan auto-sync localStorage
npx cepat make:store Supplier

# 4. Buat mock data seed baru
npx cepat make:mock-data Supplier

# 5. Ganti adapter aktif secara instan
npx cepat use:adapter payment xendit
npx cepat use:adapter shipping rajaongkir
npx cepat use:adapter storage cloudinary
npx cepat use:adapter notification websocket
npx cepat use:adapter auth sanctum

# 6. Reset database mock demo
npx cepat seed:reset

# 7. Periksa konfigurasi addon
npx cepat addon:payment-xendit
npx cepat addon:pwa
npx cepat addon:analytics
npx cepat addon:email
npx cepat addon:pdf-export
npx cepat addon:i18n
```

---

## 💳 Konfigurasi Payment Gateway & Custom Adapter

Cepat UI Olshop menggunakan **Payment Adapter Pattern** (`src/adapters/payment/`) yang seragam dan mudah diperluas.

### 1. Beralih ke Xendit Payment Gateway
Cukup jalankan satu perintah CLI:
```bash
npx cepat use:adapter payment xendit
```
Lalu konfigurasikan key di file `.env`:
```env
VITE_XENDIT_PUBLIC_KEY=xnd_public_development_xxxxxx
VITE_XENDIT_IS_SANDBOX=true
```
Halaman `/checkout` akan otomatis menampilkan opsi pembayaran modern (QRIS instan, BCA Virtual Account, Mandiri VA, dan Xendit Hosted Checkout), serta mengarahkan pembeli ke URL pembayaran invoice resmi.

### 2. Cara Menambahkan Rekening / Metode Pembayaran Manual Baru
Buka file [src/adapters/payment/manual.adapter.ts](file:///home/kangjessy/Documents/projects/cepat-ui-olshop/src/adapters/payment/manual.adapter.ts). Anda dapat menambahkan bank baru (misal: Bank BSI / BRI) ke dalam array `bankAccounts`:
```typescript
{
  id: 'bsi',
  bankName: 'BSI (Bank Syariah Indonesia)',
  accountNumber: '7123456789',
  accountName: 'PT CEPAT OLSHOP INDONESIA',
  instructions: [
    'Buka aplikasi BSI Mobile / ATM BSI',
    'Pilih Transfer > Rekening BSI',
    'Masukkan nomor rekening 7123456789 a.n. PT CEPAT OLSHOP INDONESIA',
    'Simpan bukti transfer untuk diunggah di halaman pesanan'
  ]
}
```

### 3. Cara Menambahkan Gateway Pihak Ketiga Baru (Midtrans, Doku, Tripay)
Buat file adapter baru di `src/adapters/payment/` dengan mengimplementasikan contract [PaymentAdapter](file:///home/kangjessy/Documents/projects/cepat-ui-olshop/src/adapters/payment/adapter.interface.ts):

```typescript
// src/adapters/payment/midtrans.adapter.ts
import type { PaymentAdapter, CreatePaymentParams, PaymentTransactionResult } from './adapter.interface'
import type { PaymentMethodOption } from '@/types/payment'

export class MidtransPaymentAdapter implements PaymentAdapter {
  readonly providerName = 'midtrans'

  isConfigured(): boolean {
    return !!import.meta.env.VITE_MIDTRANS_CLIENT_KEY
  }

  async getAvailableMethods(): Promise<PaymentMethodOption[]> {
    return [
      {
        id: 'midtrans_snap',
        type: 'ewallet',
        name: 'Midtrans Snap Checkout',
        description: 'Bayar via GoPay, ShopeePay, Virtual Account, atau Kartu Kredit',
        isEnabled: true
      }
    ]
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentTransactionResult> {
    // Panggil backend API Laravel atau Snap API untuk generate token
    return {
      success: true,
      provider: 'midtrans',
      reference: `SNAP-${params.orderNumber}`,
      paymentUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${params.orderId}`,
      status: 'pending'
    }
  }
}
```
Lalu ekspor adapter tersebut di [src/adapters/payment/index.ts](file:///home/kangjessy/Documents/projects/cepat-ui-olshop/src/adapters/payment/index.ts):
```typescript
export const paymentAdapter: PaymentAdapter = new MidtransPaymentAdapter()
```

---

## 🐘 Backend Laravel Reference (`examples/backend-laravel/`)

Contoh controller dan routing Laravel siap pakai tersedia di folder [examples/backend-laravel/](file:///home/kangjessy/Documents/projects/cepat-ui-olshop/examples/backend-laravel/):
- **`AuthController.php`**: Login, Register, Logout, Me (`/api/login`, `/api/register`, `/api/user`).
- **`ProductController.php`**: CRUD produk, manajemen kategori, dan endpoint pengurangan stok otomatis (`/api/products/deduct-stock`).
- **`OrderController.php`**: Pembuatan pesanan storefront, pelacakan pesanan publik, update resi kurir, dan riwayat pesanan pelanggan.
- **`routes-api.php`**: Definisi route siap tempel di file `routes/api.php` proyek Laravel Anda.

---

## 🧪 Automated Testing & CI

Proyek ini telah dilengkapi dengan unit test berbasis **Vitest** dan workflow **GitHub Actions**:

```bash
# Menjalankan pengujian otomatis (kalkulasi cart, diskon voucher, payment adapter)
npm test

# Menjalankan pemeriksaan ketat tipe data TypeScript
npm run type-check

# Menguji build produksi
npm run build
```

Workflow CI otomatis pada [.github/workflows/ci.yml](file:///home/kangjessy/Documents/projects/cepat-ui-olshop/.github/workflows/ci.yml) memastikan setiap commit dan pull request diuji integritasnya (`type-check`, `test`, dan `build`).

---

## 📁 Struktur Direktori

```text
cepat-ui-olshop/
├── bin/                       # Cepat UI Developer CLI generator (cepat.mjs)
├── public/                    # Aset statis & manifest.json PWA
├── src/
│   ├── adapters/              # Pluggable adapter contracts & implementations
│   │   ├── notification/      # Polling & WebSocket adapters
│   │   ├── shipping/          # Manual Flat Rate & RajaOngkir adapters
│   │   └── storage/           # Local, IndexedDB, & Cloudinary adapters
│   ├── addons/                # Ekosistem addons (email, i18n, pwa)
│   ├── components/            # Komponen aplikasi
│   │   ├── admin/             # Komponen khusus admin (widgets, invoice, timelines)
│   │   └── storefront/        # Komponen storefront (card, gallery, variant, cart row)
│   ├── composables/           # Vue composables (useSeo, useAnalytics, useShipping, dll)
│   ├── core/                  # Core primitives (UI buttons, cards, modals, layout shell)
│   ├── layouts/               # AdminLayout, StorefrontLayout, AuthLayout
│   ├── mock/                  # Seed data awal (produk, pesanan, pelanggan, voucher)
│   ├── router/                # Konfigurasi rute (admin.routes.ts, storefront.routes.ts)
│   ├── stores/                # Pinia stores (cart, wishlist, auth)
│   ├── types/                 # TypeScript interfaces e-commerce
│   ├── utils/                 # Utility helpers (formatCurrency, exportCsv, exportPdf)
│   └── views/                 # Halaman view admin dan storefront
└── package.json
```

---

## 📦 Build & Deployment

Untuk membuat bundel produksi yang dioptimalkan:

```bash
# Validasi tipe TypeScript
npm run type-check

# Build bundle produksi
npm run build
```

Hasil build akan berada pada folder `dist/` dan siap di-deploy ke Vercel, Netlify, Cloudflare Pages, atau server Nginx/Apache.

---

## 🤝 Kontribusi

Kontribusi selalu disambut dengan gembira! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan alur kerja dan konvensi kode.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.
