export interface VariantOption {
  id: string
  name: string // contoh: "Merah", "XL"
  priceDiff?: number // selisih harga (+10000)
  stock?: number
  sku?: string
}

export interface ProductVariantType {
  id: string
  name: string // contoh: "Ukuran", "Warna"
  options: string[] // contoh: ["S", "M", "L"]
}

export interface VariantMatrixItem {
  id: string
  combination: Record<string, string> // { "Warna": "Merah", "Ukuran": "XL" }
  price: number
  stock: number
  sku: string
  image?: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  icon?: string
  image?: string
  productCount?: number
}

export type ProductStatus = 'active' | 'out_of_stock' | 'draft' | 'archived'

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDescription?: string
  price: number
  originalPrice?: number // untuk coret harga
  discountPercent?: number
  stock: number
  category: ProductCategory
  images: string[]
  status: ProductStatus
  weight: number // dalam gram
  rating: number
  reviewCount: number
  soldCount: number
  hasVariants: boolean
  variantTypes?: ProductVariantType[]
  variantMatrix?: VariantMatrixItem[]
  createdAt: string
  updatedAt: string
}
