/**
 * Storage Keys Constants
 * Single Source of Truth for all localStorage & persistent store keys in Cepat UI Olshop.
 */

export const STORAGE_KEYS = {
  PRODUCTS: 'cepat_olshop_products',
  CATEGORIES: 'cepat_olshop_categories',
  ORDERS: 'cepat_olshop_orders',
  CUSTOMERS: 'cepat_olshop_customers',
  VOUCHERS: 'cepat_olshop_vouchers',
  FLASH_SALE: 'cepat_olshop_flash_sale',
  REVIEWS: 'cepat_olshop_reviews',
  SETTINGS: 'cepat_olshop_settings',
  CART: 'cepat_olshop_cart',
  WISHLIST: 'cepat_olshop_wishlist',
  CUSTOMER_USER: 'cepat_olshop_customer',
  CUSTOMER_TOKEN: 'cepat_olshop_customer_token'
} as const

/**
 * Fallback getter to read data whether saved with new or legacy key
 */
export function getStorageItem(key: string, legacyKey?: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null)
}

export function setStorageItem(key: string, value: string, legacyKey?: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
  if (legacyKey && legacyKey !== key) {
    localStorage.setItem(legacyKey, value)
  }
}
