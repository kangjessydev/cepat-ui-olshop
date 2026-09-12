import type { PaymentMethodOption } from './payment'
import type { ShippingCourierService } from './shipping'

export interface HeroBanner {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
}

export interface StoreContentSettings {
  banners: HeroBanner[]
  aboutUsText: string
  contactWhatsapp: string
  contactEmail: string
  contactAddress: string
  socialLinks: {
    instagram?: string
    tiktok?: string
    facebook?: string
    youtube?: string
  }
}

export interface StoreSettings {
  name: string
  tagline: string
  description: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  originCity: string
  originProvince: string
  paymentMethods: PaymentMethodOption[]
  shippingCouriers: ShippingCourierService[]
  content: StoreContentSettings
}

export interface ProductReview {
  id: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number // 1 - 5
  comment: string
  images?: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  reply?: {
    comment: string
    createdAt: string
  }
}
