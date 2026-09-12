export type DiscountType = 'fixed' | 'percentage'

export interface Voucher {
  id: string
  code: string
  title: string
  description?: string
  discountType: DiscountType
  discountValue: number // misal 20000 atau 15 (%)
  maxDiscount?: number // batas maksimal potongan untuk persen
  minOrderAmount: number
  usageLimit?: number
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface FlashSaleItem {
  productId: string
  productName: string
  productImage: string
  originalPrice: number
  flashPrice: number
  discountPercent: number
  stockQuota: number
  soldQuota: number
}

export interface FlashSaleEvent {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  showOnHome: boolean
  items: FlashSaleItem[]
}
