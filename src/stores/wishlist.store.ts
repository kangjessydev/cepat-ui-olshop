import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const WISHLIST_STORAGE_KEY = 'cepat_olshop_wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const productIds = ref<string[]>(loadWishlistFromStorage())

  function loadWishlistFromStorage(): string[] {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  watch(productIds, (val) => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  const totalCount = computed(() => productIds.value.length)

  function isWishlisted(productId: string): boolean {
    return productIds.value.includes(productId)
  }

  function toggle(productId: string): boolean {
    const idx = productIds.value.indexOf(productId)
    if (idx > -1) {
      productIds.value.splice(idx, 1)
      return false
    } else {
      productIds.value.push(productId)
      return true
    }
  }

  function remove(productId: string) {
    const idx = productIds.value.indexOf(productId)
    if (idx > -1) productIds.value.splice(idx, 1)
  }

  function clear() {
    productIds.value = []
    localStorage.removeItem(WISHLIST_STORAGE_KEY)
  }

  return {
    productIds,
    totalCount,
    isWishlisted,
    toggle,
    remove,
    clear
  }
})
