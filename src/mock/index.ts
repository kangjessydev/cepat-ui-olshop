import { productsSeed, categoriesSeed } from './products.seed'
import { ordersSeed } from './orders.seed'
import { customersSeed } from './customers.seed'
import { vouchersSeed, flashSaleSeed } from './vouchers.seed'
import { reviewsSeed } from './reviews.seed'
import type { Product, Order, Customer, Voucher, FlashSaleEvent, ProductReview, ProductCategory } from '@/types'
import { STORAGE_KEYS, setStorageItem, getStorageItem } from '@/constants/storage'

export { STORAGE_KEYS }

/**
 * Inisialisasi mock data ke localStorage jika belum ada
 */
export function initMockData(force = false): void {
  if (typeof window === 'undefined') return

  if (force || !getStorageItem(STORAGE_KEYS.PRODUCTS, 'cepat_products')) {
    setStorageItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsSeed), 'cepat_products')
  }
  if (force || !getStorageItem(STORAGE_KEYS.CATEGORIES, 'cepat_categories')) {
    setStorageItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesSeed), 'cepat_categories')
  }
  if (force || !getStorageItem(STORAGE_KEYS.ORDERS, 'cepat_orders')) {
    setStorageItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersSeed), 'cepat_orders')
  }
  if (force || !getStorageItem(STORAGE_KEYS.CUSTOMERS, 'cepat_customers')) {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customersSeed), 'cepat_customers')
  }
  if (force || !getStorageItem(STORAGE_KEYS.VOUCHERS, 'cepat_vouchers')) {
    setStorageItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchersSeed), 'cepat_vouchers')
  }
  if (force || !getStorageItem(STORAGE_KEYS.FLASH_SALE, 'cepat_flash_sale')) {
    setStorageItem(STORAGE_KEYS.FLASH_SALE, JSON.stringify(flashSaleSeed), 'cepat_flash_sale')
  }
  if (force || !getStorageItem(STORAGE_KEYS.REVIEWS, 'cepat_reviews')) {
    setStorageItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewsSeed), 'cepat_reviews')
  }
}

/**
 * Reset seluruh data demo kembali ke seed default
 */
export function resetMockData(): void {
  initMockData(true)
}

// Helper Getters & Setters
export function getMockProducts(): Product[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.PRODUCTS, 'cepat_products')
    return raw ? JSON.parse(raw) : productsSeed
  } catch {
    return productsSeed
  }
}

export function saveMockProducts(products: Product[]): void {
  setStorageItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products), 'cepat_products')
}

export function getMockCategories(): ProductCategory[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.CATEGORIES, 'cepat_categories')
    return raw ? JSON.parse(raw) : categoriesSeed
  } catch {
    return categoriesSeed
  }
}

export function getMockOrders(): Order[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.ORDERS, 'cepat_orders')
    return raw ? JSON.parse(raw) : ordersSeed
  } catch {
    return ordersSeed
  }
}

export function saveMockOrders(orders: Order[]): void {
  setStorageItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders), 'cepat_orders')
}

export function getMockCustomers(): Customer[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.CUSTOMERS, 'cepat_customers')
    return raw ? JSON.parse(raw) : customersSeed
  } catch {
    return customersSeed
  }
}

export function getMockVouchers(): Voucher[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.VOUCHERS, 'cepat_vouchers')
    return raw ? JSON.parse(raw) : vouchersSeed
  } catch {
    return vouchersSeed
  }
}

export function getMockFlashSale(): FlashSaleEvent {
  try {
    const raw = getStorageItem(STORAGE_KEYS.FLASH_SALE, 'cepat_flash_sale')
    return raw ? JSON.parse(raw) : flashSaleSeed
  } catch {
    return flashSaleSeed
  }
}

export function getMockReviews(): ProductReview[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.REVIEWS, 'cepat_reviews')
    return raw ? JSON.parse(raw) : reviewsSeed
  } catch {
    return reviewsSeed
  }
}
