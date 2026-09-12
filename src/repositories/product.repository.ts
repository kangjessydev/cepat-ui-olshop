import type { Product } from '@/types'
import type { IProductRepository } from './types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/constants/storage'
import { productsSeed } from '@/mock/products.seed'
import { useAdminApi, useCustomerApi } from '@/core/composables/useApi'

export class LocalProductRepository implements IProductRepository {
  private load(): Product[] {
    const raw = getStorageItem(STORAGE_KEYS.PRODUCTS, 'cepat_products')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return [...productsSeed]
      }
    }
    this.save([...productsSeed])
    return [...productsSeed]
  }

  private save(products: Product[]): void {
    setStorageItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products), 'cepat_products')
  }

  async getAll(): Promise<Product[]> {
    return this.load()
  }

  async getById(id: string): Promise<Product | null> {
    const products = this.load()
    return products.find(p => p.id === id) || null
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = this.load()
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.unshift(newProduct)
    this.save(products)
    return newProduct
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = this.load()
    const idx = products.findIndex(p => p.id === id)
    if (idx === -1) return null
    products[idx] = {
      ...products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.save(products)
    return products[idx]
  }

  async delete(id: string): Promise<boolean> {
    const products = this.load()
    const filtered = products.filter(p => p.id !== id)
    if (filtered.length === products.length) return false
    this.save(filtered)
    return true
  }

  async deductStock(items: { productId: string; quantity: number }[]): Promise<boolean> {
    const products = this.load()
    let changed = false
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId)
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity)
        prod.soldCount = (prod.soldCount || 0) + item.quantity
        changed = true
      }
    }
    if (changed) {
      this.save(products)
    }
    return true
  }
}

/**
 * ApiProductRepository for Laravel REST backend
 */
export class ApiProductRepository implements IProductRepository {
  private adminApi = useAdminApi()
  private customerApi = useCustomerApi()

  async getAll(): Promise<Product[]> {
    const res = await this.customerApi.get<Product[]>('/products')
    return res || []
  }

  async getById(id: string): Promise<Product | null> {
    return await this.customerApi.get<Product>(`/products/${id}`)
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await this.adminApi.post<Product>('/products', product)
    if (!res) throw new Error('Gagal menambah produk')
    return res
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    return await this.adminApi.put<Product>(`/products/${id}`, updates)
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.adminApi.delete(`/products/${id}`)
    return !!res
  }

  async deductStock(items: { productId: string; quantity: number }[]): Promise<boolean> {
    const res = await this.adminApi.post('/products/deduct-stock', { items })
    return !!res
  }
}

export const productRepository: IProductRepository = new LocalProductRepository()
