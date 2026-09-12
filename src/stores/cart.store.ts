import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { OrderItem, Voucher } from '@/types'

const CART_STORAGE_KEY = 'cepat_olshop_cart'
const VOUCHER_STORAGE_KEY = 'cepat_olshop_voucher'

export const useCartStore = defineStore('cart', () => {
  const items = ref<OrderItem[]>(loadCartFromStorage())
  const appliedVoucher = ref<Voucher | null>(loadVoucherFromStorage())

  function loadCartFromStorage(): OrderItem[] {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  function loadVoucherFromStorage(): Voucher | null {
    try {
      const saved = localStorage.getItem(VOUCHER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  // Watch and persist to localStorage
  watch(items, (val) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  watch(appliedVoucher, (val) => {
    if (val) {
      localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(val))
    } else {
      localStorage.removeItem(VOUCHER_STORAGE_KEY)
    }
  }, { deep: true })

  const totalItemsCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.subtotal, 0))

  const discountAmount = computed(() => {
    if (!appliedVoucher.value) return 0
    const v = appliedVoucher.value
    if (subtotal.value < v.minOrderAmount) return 0

    if (v.discountType === 'fixed') {
      return Math.min(subtotal.value, v.discountValue)
    } else {
      const percentDiscount = (subtotal.value * v.discountValue) / 100
      return v.maxDiscount ? Math.min(percentDiscount, v.maxDiscount) : percentDiscount
    }
  })

  const grandTotal = computed(() => Math.max(0, subtotal.value - discountAmount.value))

  function addItem(item: Omit<OrderItem, 'id' | 'subtotal'> & { id?: string }) {
    const existingIndex = items.value.findIndex(i =>
      i.productId === item.productId && i.variantDescription === item.variantDescription
    )

    if (existingIndex > -1) {
      const current = items.value[existingIndex]
      const newQty = current.quantity + item.quantity
      items.value[existingIndex] = {
        ...current,
        quantity: newQty,
        subtotal: current.price * newQty
      }
    } else {
      const id = item.id || `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      items.value.push({
        ...item,
        id,
        subtotal: item.price * item.quantity
      })
    }
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return

    if (quantity <= 0) {
      removeItem(itemId)
    } else {
      item.quantity = quantity
      item.subtotal = item.price * quantity
    }
  }

  function removeItem(itemId: string) {
    items.value = items.value.filter(i => i.id !== itemId)
  }

  function applyVoucher(voucher: Voucher) {
    if (subtotal.value < voucher.minOrderAmount) {
      throw new Error(`Minimal belanja untuk voucher ini adalah Rp ${voucher.minOrderAmount.toLocaleString('id-ID')}`)
    }
    appliedVoucher.value = voucher
  }

  function removeVoucher() {
    appliedVoucher.value = null
  }

  function clearCart() {
    items.value = []
    appliedVoucher.value = null
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(VOUCHER_STORAGE_KEY)
  }

  return {
    items,
    appliedVoucher,
    totalItemsCount,
    subtotal,
    discountAmount,
    grandTotal,
    addItem,
    updateQuantity,
    removeItem,
    applyVoucher,
    removeVoucher,
    clearCart
  }
})
