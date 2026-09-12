<template>
  <div class="space-y-6">
    <!-- Variant Types Input -->
    <div class="space-y-4">
      <div
        v-for="(type, tIdx) in variantTypes"
        :key="type.id"
        class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
      >
        <div class="flex items-center justify-between gap-2">
          <input
            v-model="type.name"
            type="text"
            placeholder="Nama Varian (cth: Warna, Ukuran)"
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            @change="regenerateMatrix"
          />
          <button
            type="button"
            @click="removeVariantType(tIdx)"
            class="p-1.5 text-slate-400 hover:text-rose-600 transition"
            title="Hapus Varian Ini"
          >
            <Trash2 :size="15" />
          </button>
        </div>

        <!-- Options Chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="(opt, oIdx) in type.options"
            :key="oIdx"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            {{ opt }}
            <button
              type="button"
              @click="removeOption(tIdx, oIdx)"
              class="text-slate-400 hover:text-rose-500 ml-0.5"
            >
              &times;
            </button>
          </span>

          <!-- Add option input -->
          <div class="inline-flex items-center gap-1">
            <input
              v-model="newOptionInputs[tIdx]"
              type="text"
              placeholder="+ Opsi baru..."
              class="px-2.5 py-1 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:border-emerald-500 w-28"
              @keydown.enter.prevent="addOption(tIdx)"
            />
            <button
              type="button"
              @click="addOption(tIdx)"
              class="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addVariantType"
        class="py-2 px-3 rounded-xl border border-dashed border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition flex items-center gap-1.5"
      >
        <Plus :size="14" /> Tambah Tipe Varian Lain
      </button>
    </div>

    <!-- Variant Matrix Table -->
    <div v-if="matrix.length > 0" class="space-y-3 pt-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Kombinasi Varian & Stok ({{ matrix.length }} Kombinasi)
        </h4>

        <!-- Bulk Apply Actions -->
        <div class="flex items-center gap-2">
          <input
            v-model.number="bulkPrice"
            type="number"
            placeholder="Set Semua Harga"
            class="w-32 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-950"
          />
          <button
            type="button"
            @click="applyBulkPrice"
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-medium"
          >
            Terapkan
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-medium">
            <tr>
              <th class="p-3">Kombinasi</th>
              <th class="p-3">SKU Varian</th>
              <th class="p-3">Harga (Rp)</th>
              <th class="p-3">Stok</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="item in matrix" :key="item.id">
              <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">
                <span class="inline-flex gap-1.5">
                  <span
                    v-for="(val, key) in item.combination"
                    :key="key"
                    class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]"
                  >
                    {{ key }}: {{ val }}
                  </span>
                </span>
              </td>
              <td class="p-3">
                <input
                  v-model="item.sku"
                  type="text"
                  class="w-28 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </td>
              <td class="p-3">
                <input
                  v-model.number="item.price"
                  type="number"
                  class="w-28 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </td>
              <td class="p-3">
                <input
                  v-model.number="item.stock"
                  type="number"
                  class="w-20 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2 } from '@lucide/vue'
import type { ProductVariantType, VariantMatrixItem } from '@/types'

interface Props {
  variantTypes: ProductVariantType[]
  matrix: VariantMatrixItem[]
  baseSku?: string
  basePrice?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:variantTypes', types: ProductVariantType[]): void
  (e: 'update:matrix', matrix: VariantMatrixItem[]): void
}>()

const newOptionInputs = ref<Record<number, string>>({})
const bulkPrice = ref<number | null>(null)

function addVariantType() {
  const newType: ProductVariantType = {
    id: `vt-${Date.now()}`,
    name: 'Varian Baru',
    options: []
  }
  emit('update:variantTypes', [...props.variantTypes, newType])
}

function removeVariantType(idx: number) {
  const next = [...props.variantTypes]
  next.splice(idx, 1)
  emit('update:variantTypes', next)
  regenerateMatrix()
}

function addOption(tIdx: number) {
  const text = (newOptionInputs.value[tIdx] || '').trim()
  if (!text) return

  const types = [...props.variantTypes]
  if (!types[tIdx].options.includes(text)) {
    types[tIdx].options.push(text)
    emit('update:variantTypes', types)
    regenerateMatrix()
  }
  newOptionInputs.value[tIdx] = ''
}

function removeOption(tIdx: number, oIdx: number) {
  const types = [...props.variantTypes]
  types[tIdx].options.splice(oIdx, 1)
  emit('update:variantTypes', types)
  regenerateMatrix()
}

function regenerateMatrix() {
  const validTypes = props.variantTypes.filter(t => t.name.trim() && t.options.length > 0)
  if (!validTypes.length) {
    emit('update:matrix', [])
    return
  }

  // Cartesian product
  let combinations: Record<string, string>[] = [{}]
  for (const t of validTypes) {
    const nextCombos: Record<string, string>[] = []
    for (const combo of combinations) {
      for (const opt of t.options) {
        nextCombos.push({ ...combo, [t.name]: opt })
      }
    }
    combinations = nextCombos
  }

  const baseSku = props.baseSku || 'SKU'
  const basePrice = props.basePrice || 100000

  const newMatrix: VariantMatrixItem[] = combinations.map((combo, idx) => {
    // Check if existing item exists
    const existing = props.matrix.find(m => {
      return Object.entries(combo).every(([k, v]) => m.combination[k] === v)
    })

    if (existing) return existing

    const suffix = Object.values(combo).map(v => v.slice(0, 3).toUpperCase()).join('-')
    return {
      id: `vm-${idx}-${Date.now()}`,
      combination: combo,
      price: basePrice,
      stock: 10,
      sku: `${baseSku}-${suffix}`
    }
  })

  emit('update:matrix', newMatrix)
}

function applyBulkPrice() {
  if (!bulkPrice.value) return
  const updated = props.matrix.map(m => ({ ...m, price: bulkPrice.value! }))
  emit('update:matrix', updated)
  bulkPrice.value = null
}
</script>
