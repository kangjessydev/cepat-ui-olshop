# Panduan Kontribusi — Cepat UI Olshop

Terima kasih atas ketertarikan Anda untuk berkontribusi pada **Cepat UI Olshop**! Proyek ini dibangun untuk menyediakan starter kit toko online modern, cepat, dan mudah dikembangkan untuk ekosistem Vue 3 di Indonesia.

---

## 📋 Alur Kontribusi

1. **Fork repository ini** ke akun GitHub Anda.
2. Buat branch baru dari `development`:
   ```bash
   git checkout -b feat/nama-fitur-baru
   ```
3. Lakukan perubahan kode dan pastikan standar penulisan dipatuhi.
4. Uji perubahan Anda dengan memastikan tidak ada error TypeScript atau build error:
   ```bash
   npm run type-check
   npm run build
   ```
5. Commit perubahan menggunakan konvensi Conventional Commits:
   - `feat(scope): deskripsi fitur baru`
   - `fix(scope): perbaikan bug`
   - `docs(scope): pembaruan dokumentasi`
   - `chore(scope): pembaruan dependensi atau konfigurasi`
6. Push ke remote fork Anda dan buka **Pull Request (PR)** yang menargetkan branch `development`.

---

## 🛠️ Standar Kode

- **Vue 3 `<script setup lang="ts">`**: Selalu gunakan Composition API dengan `<script setup>` dan TypeScript strict.
- **Tailwind CSS v4**: Gunakan class utility yang konsisten, hindari inline CSS yang tidak terstruktur.
- **Adapter Pattern**: Jika menambahkan integrasi backend (misal kurir pengiriman baru atau gateway pembayaran), buat adapter baru yang mengimplementasikan interface di `src/adapters/` agar tidak merusak logika UI.
- **Tanpa Dependency Berat**: Hindari menambah dependensi npm eksternal yang besar jika fungsionalitas tersebut dapat diselesaikan secara ringan via utility lokal atau Web API bawaan browser.

---

## 🧪 Pengujian & Verifikasi

Sebelum mengirimkan PR, jalankan perintah berikut secara berurutan:

```bash
# 1. Type checking TypeScript
npm run type-check

# 2. Production build verification
npm run build
```

Semua pemeriksaan wajib lolos dengan status **0 errors**.

---

## 💬 Pertanyaan & Bantuan

Jika Anda memiliki pertanyaan seputar arsitektur atau ingin mendiskusikan fitur baru sebelum mengimplementasikannya, silakan buka **Issue** atau diskusikan di GitHub Discussions.
