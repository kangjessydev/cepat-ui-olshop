import type { ProductReview } from '@/types'
import type { IReviewRepository } from './types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/constants/storage'
import { reviewsSeed } from '@/mock/reviews.seed'
import { useAdminApi, useCustomerApi } from '@/core/composables/useApi'

export class LocalReviewRepository implements IReviewRepository {
  private load(): ProductReview[] {
    const raw = getStorageItem(STORAGE_KEYS.REVIEWS, 'cepat_reviews')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return [...reviewsSeed]
      }
    }
    this.save([...reviewsSeed])
    return [...reviewsSeed]
  }

  private save(reviews: ProductReview[]): void {
    setStorageItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews), 'cepat_reviews')
  }

  async getAll(): Promise<ProductReview[]> {
    return this.load()
  }

  async getById(id: string): Promise<ProductReview | null> {
    const reviews = this.load()
    return reviews.find(r => r.id === id) || null
  }

  async getByProduct(productId: string): Promise<ProductReview[]> {
    const reviews = this.load()
    return reviews.filter(r => r.productId === productId && r.status === 'approved')
  }

  async create(review: ProductReview): Promise<ProductReview> {
    const reviews = this.load()
    reviews.unshift(review)
    this.save(reviews)
    return review
  }

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<ProductReview | null> {
    const reviews = this.load()
    const idx = reviews.findIndex(r => r.id === id)
    if (idx === -1) return null
    reviews[idx] = { ...reviews[idx], status }
    this.save(reviews)
    return reviews[idx]
  }

  async reply(id: string, replyText: string): Promise<ProductReview | null> {
    const reviews = this.load()
    const idx = reviews.findIndex(r => r.id === id)
    if (idx === -1) return null
    reviews[idx] = {
      ...reviews[idx],
      reply: {
        comment: replyText,
        createdAt: new Date().toISOString()
      }
    }
    this.save(reviews)
    return reviews[idx]
  }
}

export class ApiReviewRepository implements IReviewRepository {
  private adminApi = useAdminApi()
  private customerApi = useCustomerApi()

  async getAll(): Promise<ProductReview[]> {
    const res = await this.adminApi.get<ProductReview[]>('/reviews')
    return res || []
  }

  async getByProduct(productId: string): Promise<ProductReview[]> {
    const res = await this.customerApi.get<ProductReview[]>(`/products/${productId}/reviews`)
    return res || []
  }

  async create(review: ProductReview): Promise<ProductReview> {
    const res = await this.customerApi.post<ProductReview>('/reviews', review)
    if (!res) throw new Error('Gagal mengirim ulasan')
    return res
  }

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<ProductReview | null> {
    return await this.adminApi.patch<ProductReview>(`/reviews/${id}/status`, { status })
  }

  async reply(id: string, replyText: string): Promise<ProductReview | null> {
    return await this.adminApi.post<ProductReview>(`/reviews/${id}/reply`, { reply: replyText })
  }
}

export const reviewRepository: IReviewRepository = new LocalReviewRepository()
