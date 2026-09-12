export type OrderStatus =
  | 'pending_payment' // Menunggu Pembayaran / Konfirmasi Bukti
  | 'payment_verified' // Pembayaran Terverifikasi
  | 'processing' // Sedang Dikemas
  | 'shipped' // Sedang Dikirim
  | 'delivered' // Selesai / Diterima
  | 'cancelled' // Dibatalkan

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variantDescription?: string // contoh: "Warna: Merah, Ukuran: XL"
  price: number
  quantity: number
  subtotal: number
}

export interface CustomerAddress {
  recipientName: string
  phone: string
  addressLine: string
  province: string
  city: string
  subdistrict: string
  postalCode: string
  notes?: string
}

export interface OrderShippingInfo {
  courierName: string // JNE, J&T, SiCepat, dll
  serviceName: string // REG, OKE, YES
  cost: number
  trackingNumber?: string // Nomor Resi
  estimatedDelivery?: string // contoh: "2-3 Hari"
  address: CustomerAddress
}

export interface OrderPaymentInfo {
  method: 'bank_transfer' | 'cod' | 'ewallet'
  bankName?: string
  accountNumber?: string
  accountName?: string
  proofImage?: string // URL bukti transfer
  paidAt?: string
  confirmedAt?: string
  status: 'unpaid' | 'verification_pending' | 'paid' | 'failed'
}

export interface OrderTimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: string
  status: OrderStatus
  actor?: 'customer' | 'admin' | 'system'
}

export interface Order {
  id: string
  orderNumber: string // misal: "ORD-202609-001"
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  status: OrderStatus
  shipping: OrderShippingInfo
  payment: OrderPaymentInfo
  timeline: OrderTimelineEvent[]
  internalNotes?: string
  customerNotes?: string
  createdAt: string
  updatedAt: string
}
