<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ProductReview } from '@/types'
import { reviewRepository } from '@/repositories'
import { toast } from 'vue-sonner'

const reviews = ref<ProductReview[]>([])
const selectedStatus = ref<string>('all')
const searchQuery = ref('')
const selectedRating = ref<number | 'all'>('all')

// Reply modal
const isReplyModalOpen = ref(false)
const activeReview = ref<ProductReview | null>(null)
const replyText = ref('')

onMounted(async () => {
  await loadReviews()
})

async function loadReviews() {
  reviews.value = await reviewRepository.getAll()
}

function saveReviews() {
  localStorage.setItem('cepat_olshop_reviews', JSON.stringify(reviews.value))
  localStorage.setItem('cepat_reviews', JSON.stringify(reviews.value))
}

const counts = computed(() => {
  const all = reviews.value.length
  const pending = reviews.value.filter(r => r.status === 'pending').length
  const approved = reviews.value.filter(r => r.status === 'approved').length
  const rejected = reviews.value.filter(r => r.status === 'rejected').length
  return { all, pending, approved, rejected }
})

const tabs = computed(() => [
  { id: 'all', label: 'Semua Ulasan', count: counts.value.all },
  { id: 'pending', label: 'Menunggu Moderasi', count: counts.value.pending },
  { id: 'approved', label: 'Disetujui', count: counts.value.approved },
  { id: 'rejected', label: 'Ditolak', count: counts.value.rejected }
])

const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    if (selectedStatus.value !== 'all' && r.status !== selectedStatus.value) return false
    if (selectedRating.value !== 'all' && r.rating !== selectedRating.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchCust = r.customerName.toLowerCase().includes(q)
      const matchProd = (r.productName || '').toLowerCase().includes(q)
      const matchComment = r.comment.toLowerCase().includes(q)
      if (!matchCust && !matchProd && !matchComment) return false
    }
    return true
  })
})

function approveReview(review: ProductReview) {
  review.status = 'approved'
  saveReviews()
  toast.success('Ulasan disetujui dan kini tampil di storefront')
}

function rejectReview(review: ProductReview) {
  review.status = 'rejected'
  saveReviews()
  toast.info('Ulasan ditolak')
}

function openReplyModal(review: ProductReview) {
  activeReview.value = review
  replyText.value = review.reply?.comment || ''
  isReplyModalOpen.value = true
}

function handleSaveReply() {
  if (!activeReview.value) return
  if (!replyText.value.trim()) {
    toast.error('Ketik balasan toko terlebih dahulu')
    return
  }

  activeReview.value.reply = {
    comment: replyText.value.trim(),
    createdAt: new Date().toISOString()
  }
  saveReviews()
  isReplyModalOpen.value = false
  toast.success('Balasan admin berhasil disimpan!')
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Moderasi Ulasan Produk</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau feedback pelanggan, setujui ulasan yang valid, dan berikan tanggapan resmi toko
        </p>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-800">
      <nav class="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto pb-1" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'whitespace-nowrap py-3 px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors',
            selectedStatus === tab.id
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
          ]"
          @click="selectedStatus = tab.id"
        >
          {{ tab.label }}
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              selectedStatus === tab.id
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
      <div class="sm:col-span-8 relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari ulasan berdasarkan pembeli, nama produk, atau kata kunci komentar..."
          class="block w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        />
      </div>

      <div class="sm:col-span-4">
        <select
          v-model="selectedRating"
          class="block w-full py-2 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 dark:text-gray-200"
        >
          <option value="all">Semua Nilai Bintang</option>
          <option :value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
          <option :value="4">⭐⭐⭐⭐ (4 Bintang)</option>
          <option :value="3">⭐⭐⭐ (3 Bintang)</option>
          <option :value="2">⭐⭐ (2 Bintang)</option>
          <option :value="1">⭐ (1 Bintang)</option>
        </select>
      </div>
    </div>

    <!-- Review Cards List -->
    <div class="space-y-4">
      <div
        v-for="r in filteredReviews"
        :key="r.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800 p-6 space-y-4 transition-all"
      >
        <!-- Card Top Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <img
              :src="r.customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=10b981&color=fff`"
              :alt="r.customerName"
              loading="lazy"
              class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
            />
            <div>
              <p class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ r.customerName }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <!-- Stars -->
                <div class="flex items-center text-amber-400 text-xs">
                  <span v-for="star in 5" :key="star">
                    {{ star <= r.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-[11px] text-gray-400">• {{ formatDate(r.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Status Badge & Action Controls -->
          <div class="flex items-center gap-2">
            <span
              :class="[
                'text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize',
                r.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : r.status === 'pending'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
              ]"
            >
              {{ r.status === 'approved' ? 'Disetujui' : r.status === 'pending' ? 'Perlu Moderasi' : 'Ditolak' }}
            </span>

            <button
              v-if="r.status !== 'approved'"
              type="button"
              class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              @click="approveReview(r)"
            >
              Setujui
            </button>
            <button
              v-if="r.status !== 'rejected'"
              type="button"
              class="px-3 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg transition-colors"
              @click="rejectReview(r)"
            >
              Tolak
            </button>
          </div>
        </div>

        <!-- Product Subject Tag -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-900/40 text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Produk: <span class="font-medium text-gray-900 dark:text-gray-100">{{ r.productName || 'Produk' }}</span>
        </div>

        <!-- Review Comment Text -->
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-gray-900/20 p-3.5 rounded-xl">
          "{{ r.comment }}"
        </p>

        <!-- Official Store Reply Block -->
        <div v-if="r.reply" class="ml-6 p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border-l-4 border-emerald-500 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-emerald-800 dark:text-emerald-300">Tanggapan Toko (Cepat Olshop)</span>
            <button
              type="button"
              class="text-emerald-700 hover:text-emerald-800 font-semibold"
              @click="openReplyModal(r)"
            >
              Ubah Balasan
            </button>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ r.reply.comment }}</p>
          <span class="text-[10px] text-gray-400 block">{{ formatDate(r.reply.createdAt) }}</span>
        </div>

        <!-- Add Reply Button if not replied -->
        <div v-else class="flex justify-end">
          <button
            type="button"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            @click="openReplyModal(r)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Balas Ulasan Ini
          </button>
        </div>
      </div>

      <div v-if="filteredReviews.length === 0" class="py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
        <p class="font-medium text-gray-900 dark:text-gray-100">Tidak ada ulasan ditemukan</p>
        <p class="text-xs text-gray-400 mt-1">Coba ganti filter status atau kata kunci</p>
      </div>
    </div>

    <!-- Modal Balas Ulasan -->
    <div v-if="isReplyModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-base text-gray-900 dark:text-gray-100">
          Tanggapan Resmi Toko
        </h3>
        <p class="text-xs text-gray-500">
          Balasan akan tampil di bawah ulasan pembeli di halaman produk storefront.
        </p>

        <div>
          <textarea
            v-model="replyText"
            rows="4"
            placeholder="Ketik ucapan terima kasih atau solusi untuk pelanggan..."
            class="w-full text-xs p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="isReplyModalOpen = false"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            @click="handleSaveReply"
          >
            Kirim Balasan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
