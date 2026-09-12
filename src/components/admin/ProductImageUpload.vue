<template>
  <div class="space-y-3">
    <!-- Drag and Drop Dropzone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer',
        isDragging
          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-900/40'
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
          <UploadCloud :size="24" />
        </div>
        <div class="space-y-0.5">
          <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            Tarik & lepas foto produk ke sini, atau <span class="text-emerald-600 dark:text-emerald-400 underline">pilih file</span>
          </p>
          <p class="text-[11px] text-slate-400">
            Mendukung format JPG, PNG, WEBP hingga 5MB per file
          </p>
        </div>
      </div>
    </div>

    <!-- Uploading progress indicator -->
    <div v-if="isUploading" class="flex items-center gap-2 text-xs text-emerald-600 font-medium py-2">
      <BaseSpinner size="sm" color="primary" /> Mengunggah foto produk...
    </div>

    <!-- Image Previews Grid -->
    <div v-if="modelValue.length > 0" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
      <div
        v-for="(img, idx) in modelValue"
        :key="idx"
        class="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-100 dark:bg-slate-950"
      >
        <img :src="img" :alt="`Foto ${idx + 1}`" loading="lazy" class="w-full h-full object-cover" />

        <!-- Primary Badge on first item -->
        <span
          v-if="idx === 0"
          class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs"
        >
          Foto Utama
        </span>

        <!-- Hover Overlay Actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button
            v-if="idx > 0"
            type="button"
            @click.stop="makePrimary(idx)"
            class="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold"
            title="Jadikan Foto Utama"
          >
            Utama
          </button>
          <button
            type="button"
            @click.stop="removeImage(idx)"
            class="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
            title="Hapus Foto"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, UploadCloud } from '@lucide/vue'
import { useStorage } from '@/composables/useStorage'
import BaseSpinner from '@/components/base/BaseSpinner.vue'

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const { isUploading, uploadFile } = useStorage()

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function handleFiles(files: FileList | null) {
  if (!files || !files.length) return

  const newUrls: string[] = []
  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadFile(files[i])
      newUrls.push(url)
    } catch (e) {
      console.error('Upload failed:', e)
    }
  }

  emit('update:modelValue', [...props.modelValue, ...newUrls])
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
  if (target) target.value = ''
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files)
  }
}

function removeImage(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function makePrimary(index: number) {
  const next = [...props.modelValue]
  const [selected] = next.splice(index, 1)
  next.unshift(selected)
  emit('update:modelValue', next)
}
</script>
