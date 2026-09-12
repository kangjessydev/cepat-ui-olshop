import { productsSeed, categoriesSeed } from './products.seed'
import { ordersSeed } from './orders.seed'
import { customersSeed } from './customers.seed'
import { vouchersSeed, flashSaleSeed } from './vouchers.seed'
import { reviewsSeed } from './reviews.seed'
import type { Product, Order, Customer, Voucher, FlashSaleEvent, ProductReview, ProductCategory } from '@/types'

export const STORAGE_KEYS = {
  PRODUCTS: 'cepat_olshop_products',
  CATEGORIES: 'cepat_olshop_categories',
  ORDERS: 'cepat_olshop_orders',
  CUSTOMERS: 'cepat_olshop_customers',
  VOUCHERS: 'cepat_olshop_vouchers',
  FLASH_SALE: 'cepat_olshop_flash_sale',
  REVIEWS: 'cepat_olshop_reviews'
}

/**
 * Inisialisasi mock data ke localStorage jika belum ada
 */
export function initMockData(force = false): void {
  if (typeof window === 'undefined') return

  if (force || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customersSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.VOUCHERS)) {
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchersSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.FLASH_SALE)) {
    localStorage.setItem(STORAGE_KEYS.FLASH_SALE, JSON.stringify(flashSaleSeed))
  }
  if (force || !localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewsSeed))
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
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return raw ? JSON.parse(raw) : productsSeed
  } catch {
    return productsSeed
  }
}

export function saveMockProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
}

export function getMockCategories(): ProductCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return raw ? JSON.parse(raw) : categoriesSeed
  } catch {
    return categoriesSeed
  }
}

export function getMockOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return raw ? JSON.parse(raw) : ordersSeed
  } catch {
    return ordersSeed
  }
}

export function saveMockOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

export function getMockCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS)
    return raw ? JSON.parse(raw) : customersSeed
  } catch {
    return customersSeed
  }
}

export function getMockVouchers(): Voucher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOUCHERS)
    return raw ? JSON.parse(raw) : vouchersSeed
  } catch {
    return vouchersSeed
  }
}

export function getMockFlashSale(): FlashSaleEvent {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASH_SALE)
    return raw ? JSON.parse(raw) : flashSaleSeed
  } catch {
    return flashSaleSeed
  }
}

export function getMockReviews(): ProductReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS)
    return raw ? JSON.parse(raw) : reviewsSeed
  } catch {
    return reviewsSeed
  }
}

export function saveMockReviews(reviews: ProductReview[]): void {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
}

export * from './products.seed'
export * from './orders.seed'
export * from './customers.seed'
export * from './vouchers.seed'
export * from './reviews.seed'
