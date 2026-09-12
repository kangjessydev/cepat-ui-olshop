<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link
          to="/admin/products"
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition"
        >
          <ArrowLeft :size="18" />
        </router-link>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ isEditMode ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Lengkapi data produk, foto, harga, dan variasi untuk katalog toko Anda
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="saveProduct"
        :disabled="isSubmitting"
        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <BaseSpinner v-if="isSubmitting" size="sm" color="white" />
        <Save v-else :size="16" />
        Simpan Produk
      </button>
    </div>

    <!-- Form Sections -->
    <form @submit.prevent="saveProduct" class="space-y-6">
      <!-- Section 1: Informasi Dasar -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white">Informasi Dasar</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Produk <span class="text-rose-500">*</span></label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Kemeja Linen Pria Oversize"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
              @input="onNameChange"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Kategori <span class="text-rose-500">*</span></label>
            <select
              v-model="form.categoryId"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">SKU Utama <span class="text-rose-500">*</span></label>
            <input
              v-model="form.sku"
              type="text"
              placeholder="Contoh: KEM-LNN-001"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Berat Produk (Gram) <span class="text-rose-500">*</span></label>
            <input
              v-model.number="form.weight"
              type="number"
              placeholder="Contoh: 350"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Slug URL</label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="otomatis-dari-nama-produk"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 font-mono focus:outline-none"
            />
          </div>

          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Deskripsi Lengkap <span class="text-rose-500">*</span></label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Jelaskan detail material, spesifikasi, dan keunggulan produk Anda..."
              class="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Foto Produk -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div>
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">Foto Produk</h3>
          <p class="text-xs text-slate-500">Unggah foto produk dari berbagai sudut pandang (minimal 1 foto)</p>
        </div>
        <ProductImageUpload v-model="form.images" />
      </div>

      <!-- Section 3: Harga & Inventori -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white">Harga & Stok</h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Harga Jual (Rp) <span class="text-rose-500">*</span></label>
            <input
              v-model.number="form.price"
              type="number"
              placeholder="0"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Harga Coret / Asli (Opsional)</label>
            <input
              v-model.number="form.originalPrice"
              type="number"
              placeholder="Contoh: 300000"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Stok Total</label>
            <input
              v-model.number="form.stock"
              type="number"
              placeholder="0"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Section 4: Varian Produk -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Varian Produk</h3>
            <p class="text-xs text-slate-500">Aktifkan jika produk memiliki opsi seperti ukuran, warna, atau rasa</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="form.hasVariants" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div v-if="form.hasVariants" class="pt-2">
          <VariantBuilder
            v-model:variantTypes="form.variantTypes"
            v-model:matrix="form.variantMatrix"
            :baseSku="form.sku"
            :basePrice="form.price"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Save } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { getMockProducts, saveMockProducts, getMockCategories } from '@/mock'
import { useToast } from '@/composables/useToast'
import ProductImageUpload from '@/components/admin/ProductImageUpload.vue'
import VariantBuilder from '@/components/admin/VariantBuilder.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import type { Product, ProductVariantType, VariantMatrixItem } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const categories = getMockCategories()
const isSubmitting = ref(false)
const isEditMode = computed(() => !!route.params.id)

const form = ref({
  name: '',
  slug: '',
  sku: '',
  categoryId: categories[0]?.id || '',
  weight: 500,
  description: '',
  images: [] as string[],
  price: 150000,
  originalPrice: undefined as number | undefined,
  stock: 20,
  hasVariants: false,
  variantTypes: [] as ProductVariantType[],
  variantMatrix: [] as VariantMatrixItem[]
})

onMounted(() => {
  if (isEditMode.value) {
    const products = getMockProducts()
    const target = products.find(p => p.id === route.params.id)
    if (target) {
      form.value = {
        name: target.name,
        slug: target.slug,
        sku: target.sku,
        categoryId: target.category?.id || '',
        weight: target.weight,
        description: target.description,
        images: [...target.images],
        price: target.price,
        originalPrice: target.originalPrice,
        stock: target.stock,
        hasVariants: target.hasVariants,
        variantTypes: target.variantTypes ? JSON.parse(JSON.stringify(target.variantTypes)) : [],
        variantMatrix: target.variantMatrix ? JSON.parse(JSON.stringify(target.variantMatrix)) : []
      }
    }
  }
})

function onNameChange() {
  if (!isEditMode.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

async function saveProduct() {
  if (!form.value.name.trim()) {
    toast.error('Nama produk wajib diisi')
    return
  }
  if (!form.value.sku.trim()) {
    toast.error('SKU produk wajib diisi')
    return
  }
  if (form.value.images.length === 0) {
    toast.error('Unggah minimal 1 foto produk')
    return
  }

  isSubmitting.value = true
  const products = getMockProducts()
  const category = categories.find(c => c.id === form.value.categoryId) || categories[0]

  if (isEditMode.value) {
    const idx = products.findIndex(p => p.id === route.params.id)
    if (idx > -1) {
      products[idx] = {
        ...products[idx],
        ...form.value,
        category,
        updatedAt: new Date().toISOString()
      }
    }
  } else {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...form.value,
      category,
      status: 'active',
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.unshift(newProduct)
  }

  saveMockProducts(products)
  isSubmitting.value = false
  toast.success(isEditMode.value ? 'Produk berhasil diperbarui' : 'Produk baru berhasil ditambahkan')
  router.push('/admin/products')
}
</script>
